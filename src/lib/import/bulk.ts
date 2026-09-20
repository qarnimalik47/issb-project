/**
 * Bulk question import from CSV (what authors keep in spreadsheets) or JSON
 * (shaped exactly like the SeedQuestion files, so seed data round-trips).
 *
 * Every row is validated and deduplicated before anything is written, and
 * problems are reported per row with the line an author can find in their
 * sheet. A dry run (the default) writes nothing. A real run inserts in chunks
 * and is deliberately NOT one transaction: for a 1,000-row sheet, 986 imported
 * plus a clear report beats an all-or-nothing rollback caused by row 987.
 */
import { inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { mediaAssets, questions, testTypes } from '../db/schema/content'
import { questionContentHash } from './parse'
import { parseCsv } from './csv'
import { optionProblems, publishReadiness, type ReadinessOption } from '../content/readiness'

export const MAX_IMPORT_ROWS = 5000
const INSERT_CHUNK = 100
const LETTERS = 'ABCDEFGH'
const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
type Difficulty = (typeof DIFFICULTIES)[number]

/** The CSV columns, in template order. Header matching is case-insensitive. */
export const CSV_COLUMNS = [
  'test_type',
  'stem_en',
  'stem_ur',
  ...[...LETTERS].map((l) => `option_${l.toLowerCase()}_en`),
  ...[...LETTERS].map((l) => `option_${l.toLowerCase()}_ur`),
  'correct_option',
  'explanation_en',
  'explanation_ur',
  'difficulty',
  'topic',
  'media_id',
] as const
const REQUIRED_COLUMNS = ['test_type', 'stem_en']

type Row = {
  line: number
  testTypeCode: string
  stemEn: string
  stemUr: string | null
  options: ReadinessOption[]
  correctOption: string | null
  explanationEn: string | null
  explanationUr: string | null
  difficulty: string
  topic: string | null
  mediaId: string | null
}

export type BulkImportReport = {
  format: 'csv' | 'json'
  dryRun: boolean
  total: number
  /** Rows that passed validation and are not duplicates. */
  valid: number
  created: number
  published: number
  errors: { line: number; messages: string[] }[]
  duplicates: { line: number; reason: string }[]
  /** Publish was requested, but these valid rows are not answerable yet (imported as drafts). */
  notPublished: { line: number; reasons: string[] }[]
}

const clean = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const orNull = (v: string): string | null => v || null

// --- Readers ------------------------------------------------------------------

type Read = { rows: Row[]; errors: BulkImportReport['errors']; total: number }

function readCsv(content: string): Read {
  const { records, errors: parseErrors } = parseCsv(content)
  const errors = parseErrors.map((e) => ({ line: e.line, messages: [e.message] }))
  const [header, ...body] = records
  if (!header) {
    return { rows: [], errors: [...errors, { line: 1, messages: ['The file is empty'] }], total: 0 }
  }

  const names = header.fields.map((h) => h.trim().toLowerCase())
  const missing = REQUIRED_COLUMNS.filter((c) => !names.includes(c))
  const unknown = names.filter((n) => n && !(CSV_COLUMNS as readonly string[]).includes(n))
  if (missing.length || unknown.length) {
    const messages = [
      ...(missing.length ? [`Missing required column(s): ${missing.join(', ')}`] : []),
      ...(unknown.length ? [`Unknown column(s): ${unknown.join(', ')}`] : []),
    ]
    return { rows: [], errors: [...errors, { line: header.line, messages }], total: body.length }
  }

  const rows: Row[] = []
  for (const rec of body) {
    if (rec.fields.length !== names.length) {
      errors.push({
        line: rec.line,
        messages: [`Expected ${names.length} columns, found ${rec.fields.length}`],
      })
      continue
    }
    const get = (col: string) => clean(rec.fields[names.indexOf(col)])
    const options: ReadinessOption[] = []
    const optionErrors: string[] = []
    let gapAt: string | null = null
    for (const letter of LETTERS) {
      const en = get(`option_${letter.toLowerCase()}_en`)
      const ur = get(`option_${letter.toLowerCase()}_ur`)
      if (!en && !ur) {
        gapAt ??= letter
        continue
      }
      if (gapAt) optionErrors.push(`Options must be consecutive from A (option ${gapAt} is empty)`)
      if (!en) optionErrors.push(`Option ${letter} has Urdu text but no English`)
      options.push({ key: letter, textEn: en, ...(ur ? { textUr: ur } : {}) })
    }
    if (optionErrors.length) {
      errors.push({ line: rec.line, messages: [...new Set(optionErrors)] })
      continue
    }
    rows.push({
      line: rec.line,
      testTypeCode: get('test_type').toLowerCase(),
      stemEn: get('stem_en'),
      stemUr: orNull(get('stem_ur')),
      options,
      correctOption: orNull(get('correct_option').toUpperCase()),
      explanationEn: orNull(get('explanation_en')),
      explanationUr: orNull(get('explanation_ur')),
      difficulty: get('difficulty').toLowerCase() || 'medium',
      topic: orNull(get('topic')),
      mediaId: orNull(get('media_id')),
    })
  }
  return { rows, errors, total: body.length }
}

function readJson(content: string): Read {
  let data: unknown
  try {
    // Strip a UTF-8 BOM (Windows editors add one).
    data = JSON.parse(content.charCodeAt(0) === 0xfeff ? content.slice(1) : content)
  } catch {
    return { rows: [], errors: [{ line: 1, messages: ['The file is not valid JSON'] }], total: 0 }
  }
  if (!Array.isArray(data)) {
    return {
      rows: [],
      errors: [{ line: 1, messages: ['Expected a JSON array of questions'] }],
      total: 0,
    }
  }
  const rows: Row[] = []
  const errors: BulkImportReport['errors'] = []
  data.forEach((raw, i) => {
    const item = i + 1
    if (!raw || typeof raw !== 'object') {
      errors.push({ line: item, messages: ['Each item must be an object'] })
      return
    }
    const q = raw as Record<string, unknown>
    const rawOptions = Array.isArray(q.options) ? q.options : []
    const options = rawOptions.map((o) => {
      const opt = (o ?? {}) as Record<string, unknown>
      const textUr = clean(opt.textUr)
      return {
        key: clean(opt.key).toUpperCase(),
        textEn: clean(opt.textEn),
        ...(textUr ? { textUr } : {}),
      }
    })
    rows.push({
      line: item,
      testTypeCode: clean(q.testTypeCode).toLowerCase(),
      stemEn: clean(q.stemEn),
      stemUr: orNull(clean(q.stemUr)),
      options,
      correctOption: orNull(clean(q.correctOption).toUpperCase()),
      explanationEn: orNull(clean(q.explanationEn)),
      explanationUr: orNull(clean(q.explanationUr)),
      difficulty: clean(q.difficulty).toLowerCase() || 'medium',
      topic: orNull(clean(q.topic)),
      mediaId: orNull(clean(q.mediaId)),
    })
  })
  return { rows, errors, total: data.length }
}

// --- Engine ---------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Authors read the report top to bottom against their sheet. */
function inLineOrder(report: BulkImportReport): BulkImportReport {
  const byLine = (x: { line: number }, y: { line: number }) => x.line - y.line
  report.errors.sort(byLine)
  report.duplicates.sort(byLine)
  report.notPublished.sort(byLine)
  return report
}

export async function runBulkImport(input: {
  content: string
  format: 'csv' | 'json'
  dryRun: boolean
  publish: boolean
  userId: string
}): Promise<BulkImportReport> {
  const read = input.format === 'csv' ? readCsv(input.content) : readJson(input.content)
  const report: BulkImportReport = {
    format: input.format,
    dryRun: input.dryRun,
    total: read.total,
    valid: 0,
    created: 0,
    published: 0,
    errors: [...read.errors],
    duplicates: [],
    notPublished: [],
  }
  if (read.rows.length > MAX_IMPORT_ROWS) {
    report.errors.push({
      line: 1,
      messages: [
        `Too many rows (${read.rows.length}); split the file into parts of ${MAX_IMPORT_ROWS}`,
      ],
    })
    return inLineOrder(report)
  }

  const types = await db
    .select({ id: testTypes.id, code: testTypes.code, scoringType: testTypes.scoringType })
    .from(testTypes)
  const typeByCode = new Map(types.map((t) => [t.code.toLowerCase(), t]))
  const mediaIds = [
    ...new Set(read.rows.map((r) => r.mediaId).filter((m): m is string => !!m && UUID_RE.test(m))),
  ]
  const knownMedia = new Set(
    mediaIds.length
      ? (
          await db
            .select({ id: mediaAssets.id })
            .from(mediaAssets)
            .where(inArray(mediaAssets.id, mediaIds))
        ).map((m) => m.id)
      : [],
  )

  // 1. Validate every row.
  type Candidate = Row & {
    testTypeId: string
    objective: boolean
    hash: string
    difficulty: Difficulty
  }
  const candidates: Candidate[] = []
  for (const row of read.rows) {
    const messages: string[] = []
    const type = typeByCode.get(row.testTypeCode)
    if (!row.testTypeCode) messages.push('test_type is empty')
    else if (!type) messages.push(`Unknown test type "${row.testTypeCode}"`)
    if (!row.stemEn) messages.push('The English question text is empty')
    if (row.stemEn.length > 4000) messages.push('The English question text is over 4000 characters')
    if (!(DIFFICULTIES as readonly string[]).includes(row.difficulty)) {
      messages.push(`Difficulty must be easy, medium or hard (got "${row.difficulty}")`)
    }
    if (row.options.length > LETTERS.length) messages.push('At most 8 options are allowed')
    messages.push(...optionProblems(row.options, row.correctOption))
    if (row.correctOption && row.options.length === 0) {
      messages.push('correct_option is set but there are no options')
    }
    if (type?.scoringType === 'objective' && row.options.length < 2) {
      messages.push('An MCQ needs at least 2 options')
    }
    if (type && type.scoringType !== 'objective' && row.options.length > 0) {
      messages.push(`"${type.code}" is a written test — its questions take no options`)
    }
    if (row.mediaId && !knownMedia.has(row.mediaId)) {
      messages.push(`media_id ${row.mediaId} is not in the figure library`)
    }
    if (messages.length) {
      report.errors.push({ line: row.line, messages })
      continue
    }
    candidates.push({
      ...row,
      testTypeId: type!.id,
      objective: type!.scoringType === 'objective',
      hash: questionContentHash(row.stemEn, row.options),
      difficulty: row.difficulty as Difficulty,
    })
  }

  // 2. Deduplicate: within the file, then against the live bank.
  const firstLineByHash = new Map<string, number>()
  const unique: Candidate[] = []
  for (const c of candidates) {
    const first = firstLineByHash.get(c.hash)
    if (first !== undefined) {
      report.duplicates.push({
        line: c.line,
        reason: `Same question as line ${first} of this file`,
      })
      continue
    }
    firstLineByHash.set(c.hash, c.line)
    unique.push(c)
  }
  const existing = new Set<string>()
  for (let i = 0; i < unique.length; i += 500) {
    const hashes = unique.slice(i, i + 500).map((c) => c.hash)
    const found = await db
      .select({ h: questions.contentHash })
      .from(questions)
      .where(inArray(questions.contentHash, hashes))
    for (const f of found) existing.add(f.h)
  }
  const fresh = unique.filter((c) => {
    if (!existing.has(c.hash)) return true
    report.duplicates.push({ line: c.line, reason: 'Already in the question bank' })
    return false
  })
  report.valid = fresh.length

  // 3. Decide what gets published.
  const publishable = new Set<string>()
  if (input.publish) {
    for (const c of fresh) {
      const reasons = publishReadiness({
        stemEn: c.stemEn,
        options: c.options,
        correctOption: c.correctOption,
        objective: c.objective,
      })
      if (reasons.length) report.notPublished.push({ line: c.line, reasons })
      else publishable.add(c.hash)
    }
  }

  if (input.dryRun) {
    report.published = publishable.size
    return inLineOrder(report)
  }

  // 4. Insert in chunks. A row that lost a race to a concurrent insert is a
  //    duplicate, not an error.
  for (let i = 0; i < fresh.length; i += INSERT_CHUNK) {
    const chunk = fresh.slice(i, i + INSERT_CHUNK)
    const inserted = await db
      .insert(questions)
      .values(
        chunk.map((c) => ({
          testTypeId: c.testTypeId,
          stemEn: c.stemEn,
          stemUr: c.stemUr,
          options: c.options.length ? c.options : null,
          correctOption: c.correctOption,
          explanationEn: c.explanationEn,
          explanationUr: c.explanationUr,
          difficulty: c.difficulty,
          topic: c.topic,
          mediaId: c.mediaId,
          contentHash: c.hash,
          status: publishable.has(c.hash) ? ('published' as const) : ('draft' as const),
          createdBy: input.userId,
        })),
      )
      .onConflictDoNothing({ target: questions.contentHash })
      .returning({ hash: questions.contentHash, status: questions.status })
    const landed = new Set(inserted.map((r) => r.hash))
    report.created += inserted.length
    report.published += inserted.filter((r) => r.status === 'published').length
    for (const c of chunk) {
      if (!landed.has(c.hash)) {
        report.duplicates.push({
          line: c.line,
          reason: 'Added to the bank by someone else meanwhile',
        })
      }
    }
  }
  return inLineOrder(report)
}
