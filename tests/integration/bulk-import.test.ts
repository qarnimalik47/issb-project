import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { eq, like } from 'drizzle-orm'
import { runBulkImport, CSV_COLUMNS } from '../../src/lib/import/bulk'
import { csvCell } from '../../src/lib/import/csv'

const tag = `bi${Date.now()}`
let userId: string
let testTypeId: string

/** Build a CSV from partial rows keyed by column name. */
function csv(rows: Record<string, string>[]): string {
  const lines = [CSV_COLUMNS.join(',')]
  for (const r of rows) lines.push(CSV_COLUMNS.map((c) => csvCell(r[c] ?? '')).join(','))
  return lines.join('\r\n') + '\r\n'
}

const good = (n: number, extra: Record<string, string> = {}) => ({
  test_type: tag,
  stem_en: `${tag} question ${n}`,
  stem_ur: `سوال ${n}`,
  option_a_en: 'Alpha',
  option_b_en: 'Beta',
  option_c_en: 'Gamma',
  option_a_ur: 'الفا',
  correct_option: 'b',
  difficulty: 'Easy',
  topic: 'bulk',
  ...extra,
})

describe('bulk question import (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Bulk', email: `${tag}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: tag,
        nameEn: 'Bulk IT',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'objective',
        timing: {},
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id
  })

  afterAll(async () => {
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  const file = csv([
    good(1), // line 2
    good(2, { correct_option: 'E' }), // line 3 — key not among options
    good(3, { test_type: 'nope' }), // line 4 — unknown test type
    good(1), // line 5 — duplicate of line 2
    good(4, { stem_en: `${tag} multi-line,\nwith a comma`, correct_option: '' }), // lines 6–7, no key
    good(5, { option_b_en: '', correct_option: 'A' }), // line 8 — gap at B
  ])

  it('dry run reports per row and writes nothing', async () => {
    const r = await runBulkImport({
      content: file,
      format: 'csv',
      dryRun: true,
      publish: true,
      userId,
    })
    expect(r.total).toBe(6)
    expect(r.valid).toBe(2)
    expect(r.created).toBe(0)
    expect(r.errors.map((e) => e.line)).toEqual([3, 4, 8])
    expect(r.errors[0]!.messages.join()).toMatch(/"E" is not one of the options/)
    expect(r.errors[1]!.messages.join()).toMatch(/Unknown test type "nope"/)
    expect(r.errors[2]!.messages.join()).toMatch(/consecutive from A/)
    expect(r.duplicates).toEqual([{ line: 5, reason: 'Same question as line 2 of this file' }])
    // The multi-line row starts on line 6 and has no key, so it can't be published.
    expect(r.notPublished).toEqual([{ line: 6, reasons: ['No correct answer is selected'] }])
    expect(r.published).toBe(1)
    const rows = await db
      .select()
      .from(questions)
      .where(like(questions.stemEn, `${tag}%`))
    expect(rows).toHaveLength(0)
  })

  it('real run creates the valid rows and publishes only the answerable ones', async () => {
    const r = await runBulkImport({
      content: file,
      format: 'csv',
      dryRun: false,
      publish: true,
      userId,
    })
    expect(r.created).toBe(2)
    expect(r.published).toBe(1)
    const rows = await db.select().from(questions).where(eq(questions.testTypeId, testTypeId))
    const first = rows.find((q) => q.stemEn === `${tag} question 1`)!
    expect(first.status).toBe('published')
    expect(first.correctOption).toBe('B')
    expect(first.difficulty).toBe('easy')
    expect(first.stemUr).toBe('سوال 1')
    expect(first.options).toEqual([
      { key: 'A', textEn: 'Alpha', textUr: 'الفا' },
      { key: 'B', textEn: 'Beta' },
      { key: 'C', textEn: 'Gamma' },
    ])
    const multi = rows.find((q) => q.stemEn.includes('multi-line'))!
    expect(multi.stemEn).toBe(`${tag} multi-line,\nwith a comma`)
    expect(multi.status).toBe('draft')
  })

  it('re-running the same file reports duplicates and creates nothing', async () => {
    const r = await runBulkImport({
      content: file,
      format: 'csv',
      dryRun: false,
      publish: true,
      userId,
    })
    expect(r.created).toBe(0)
    expect(r.duplicates.map((d) => d.reason)).toContain('Already in the question bank')
  })

  it('accepts JSON shaped like the seed files', async () => {
    const content = JSON.stringify([
      {
        testTypeCode: tag,
        stemEn: `${tag} json item`,
        stemUr: 'جے سن',
        options: [
          { key: 'A', textEn: 'Yes', textUr: 'ہاں' },
          { key: 'B', textEn: 'No', textUr: 'نہیں' },
        ],
        correctOption: 'A',
        explanationEn: 'Because.',
        topic: 'json',
        difficulty: 'hard',
      },
      'not an object',
    ])
    const r = await runBulkImport({
      content,
      format: 'json',
      dryRun: false,
      publish: false,
      userId,
    })
    expect(r.created).toBe(1)
    expect(r.errors).toEqual([{ line: 2, messages: ['Each item must be an object'] }])
    const [q] = await db
      .select()
      .from(questions)
      .where(eq(questions.stemEn, `${tag} json item`))
    expect(q!.status).toBe('draft')
    expect(q!.difficulty).toBe('hard')
  })

  it('rejects a file with missing or unknown columns up front', async () => {
    const r = await runBulkImport({
      content: 'stem_en,colour\nQ,red\n',
      format: 'csv',
      dryRun: true,
      publish: false,
      userId,
    })
    expect(r.errors).toEqual([
      {
        line: 1,
        messages: ['Missing required column(s): test_type', 'Unknown column(s): colour'],
      },
    ])
  })
})
