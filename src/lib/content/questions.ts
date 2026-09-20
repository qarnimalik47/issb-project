/**
 * Question bank management — the logic behind /api/admin/questions*.
 *
 * Kept as library functions rather than inline in the routes because the
 * routes' `requireRole` reads cookies; integration tests exercise these
 * directly, the same way every other service in the codebase is tested.
 */
import { and, count, desc, eq, ilike, inArray, isNull, or, type SQL } from 'drizzle-orm'
import { db } from '../db/index'
import { mediaAssets, questions, testTypes } from '../db/schema/content'
import { questionContentHash } from '../import/parse'
import { isUniqueViolation } from '../db/errors'
import { ApiError } from '../api/errors'
import { signedUrl } from '../storage/index'
import { optionProblems, publishReadiness, type ReadinessOption } from './readiness'
import type {
  CreateQuestionInput,
  ListQuestionsInput,
  UpdateQuestionInput,
} from '../validation/content'

type QuestionRow = typeof questions.$inferSelect

const DUPLICATE_MESSAGE = 'Another question already has exactly this text and these options'

/** Escape LIKE wildcards so a search for "50%" matches literally. */
function likePattern(s: string): string {
  return `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`
}

async function objectiveFor(testTypeId: string): Promise<boolean> {
  const [tt] = await db
    .select({ scoringType: testTypes.scoringType })
    .from(testTypes)
    .where(eq(testTypes.id, testTypeId))
    .limit(1)
  if (!tt) throw new ApiError('validation_failed', 'Unknown test type')
  return tt.scoringType === 'objective'
}

async function assertMediaExists(mediaId: string | null | undefined) {
  if (!mediaId) return
  const [m] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, mediaId))
    .limit(1)
  if (!m) throw new ApiError('validation_failed', 'The selected figure no longer exists')
}

function readinessOf(row: QuestionRow, objective: boolean): string[] {
  return publishReadiness({
    stemEn: row.stemEn,
    options: row.options as ReadinessOption[] | null,
    correctOption: row.correctOption,
    objective,
  })
}

export async function listQuestions(f: ListQuestionsInput) {
  const conds: SQL[] = []
  if (f.testTypeId) conds.push(eq(questions.testTypeId, f.testTypeId))
  if (f.status) conds.push(eq(questions.status, f.status))
  if (f.topic) conds.push(eq(questions.topic, f.topic))
  if (f.difficulty) conds.push(eq(questions.difficulty, f.difficulty))
  if (f.q) {
    const pattern = likePattern(f.q)
    conds.push(or(ilike(questions.stemEn, pattern), ilike(questions.stemUr, pattern))!)
  }
  if (f.missingUrdu) conds.push(or(isNull(questions.stemUr), eq(questions.stemUr, ''))!)
  const where = conds.length ? and(...conds) : undefined

  const [rows, totals] = await Promise.all([
    db
      .select({
        q: questions,
        testTypeCode: testTypes.code,
        testTypeName: testTypes.nameEn,
        scoringType: testTypes.scoringType,
      })
      .from(questions)
      .innerJoin(testTypes, eq(questions.testTypeId, testTypes.id))
      .where(where)
      .orderBy(desc(questions.updatedAt), desc(questions.id))
      .limit(f.pageSize)
      .offset((f.page - 1) * f.pageSize),
    db.select({ n: count() }).from(questions).where(where),
  ])

  return {
    questions: rows.map((r) => ({
      ...r.q,
      testTypeCode: r.testTypeCode,
      testTypeName: r.testTypeName,
      readiness: readinessOf(r.q, r.scoringType === 'objective'),
    })),
    page: f.page,
    pageSize: f.pageSize,
    total: totals[0]?.n ?? 0,
  }
}

/** One question plus a signed preview URL for its figure, for the editor. */
export async function getQuestionForEditor(id: string) {
  const [row] = await db
    .select({ q: questions, mediaKey: mediaAssets.storageKey })
    .from(questions)
    .leftJoin(mediaAssets, eq(questions.mediaId, mediaAssets.id))
    .where(eq(questions.id, id))
    .limit(1)
  if (!row) return null
  return { ...row.q, mediaUrl: row.mediaKey ? signedUrl(row.mediaKey, 3600) : null }
}

export async function createQuestion(input: CreateQuestionInput, userId: string) {
  await objectiveFor(input.testTypeId)
  await assertMediaExists(input.mediaId)
  const options = input.options ?? null
  const contentHash = questionContentHash(input.stemEn, options ?? [])

  const [created] = await db
    .insert(questions)
    .values({
      testTypeId: input.testTypeId,
      bankId: input.bankId,
      stemEn: input.stemEn,
      stemUr: input.stemUr || null,
      options,
      correctOption: input.correctOption || null,
      explanationEn: input.explanationEn || null,
      explanationUr: input.explanationUr || null,
      difficulty: input.difficulty,
      topic: input.topic?.trim() || null,
      mediaId: input.mediaId ?? null,
      contentHash,
      status: 'draft',
      createdBy: userId,
    })
    .onConflictDoNothing({ target: questions.contentHash })
    .returning()
  if (!created) throw new ApiError('conflict', DUPLICATE_MESSAGE)
  return created
}

/**
 * Apply a partial update. The stored row and the patch are merged BEFORE any
 * check: a PATCH carrying only `correctOption` passes the schema (options are
 * absent there) yet could point the key at an option that doesn't exist.
 */
export async function updateQuestion(id: string, patch: UpdateQuestionInput) {
  const [existing] = await db.select().from(questions).where(eq(questions.id, id)).limit(1)
  if (!existing) throw new ApiError('not_found', 'Question not found')

  const testTypeId = patch.testTypeId ?? existing.testTypeId
  const objective = await objectiveFor(testTypeId)
  if (patch.mediaId !== undefined) await assertMediaExists(patch.mediaId)

  const stemEn = patch.stemEn ?? existing.stemEn
  const options =
    patch.options !== undefined ? patch.options : (existing.options as ReadinessOption[] | null)
  const correctOption =
    patch.correctOption !== undefined ? patch.correctOption || null : existing.correctOption
  const status = patch.status ?? existing.status

  const problems = optionProblems(options, correctOption)
  if (problems.length) {
    throw new ApiError('validation_failed', problems[0]!, {
      details: problems.map((message) => ({ path: 'options', message })),
    })
  }
  // A published question must stay answerable, whether this PATCH publishes
  // it or edits one that is already live.
  if (status === 'published') {
    const reasons = publishReadiness({ stemEn, options, correctOption, objective })
    if (reasons.length) {
      throw new ApiError('validation_failed', 'This question is not ready to publish', {
        details: reasons.map((message) => ({ path: 'status', message })),
      })
    }
  }

  const contentChanged = patch.stemEn !== undefined || patch.options !== undefined
  try {
    const [updated] = await db
      .update(questions)
      .set({
        testTypeId,
        stemEn,
        options,
        correctOption,
        status,
        ...(patch.bankId !== undefined ? { bankId: patch.bankId } : {}),
        ...(patch.stemUr !== undefined ? { stemUr: patch.stemUr || null } : {}),
        ...(patch.explanationEn !== undefined
          ? { explanationEn: patch.explanationEn || null }
          : {}),
        ...(patch.explanationUr !== undefined
          ? { explanationUr: patch.explanationUr || null }
          : {}),
        ...(patch.difficulty !== undefined ? { difficulty: patch.difficulty } : {}),
        ...(patch.topic !== undefined ? { topic: patch.topic?.trim() || null } : {}),
        ...(patch.mediaId !== undefined ? { mediaId: patch.mediaId } : {}),
        contentHash: questionContentHash(stemEn, options ?? []),
        version: existing.version + (contentChanged ? 1 : 0),
        updatedAt: new Date(),
      })
      .where(eq(questions.id, id))
      .returning()
    return updated!
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError('conflict', DUPLICATE_MESSAGE)
    throw err
  }
}

export type BulkAction = 'publish' | 'unpublish' | 'archive'

/**
 * Change the status of many questions at once. Publishing goes through the
 * same readiness gate as a single publish; items that fail are skipped with
 * their reasons rather than failing the whole batch.
 */
export async function bulkSetStatus(ids: string[], action: BulkAction) {
  const unique = [...new Set(ids)]
  const rows = await db
    .select({ q: questions, scoringType: testTypes.scoringType })
    .from(questions)
    .innerJoin(testTypes, eq(questions.testTypeId, testTypes.id))
    .where(inArray(questions.id, unique))

  const found = new Set(rows.map((r) => r.q.id))
  const skipped: { id: string; reasons: string[] }[] = unique
    .filter((id) => !found.has(id))
    .map((id) => ({ id, reasons: ['Question not found'] }))

  let eligible = rows.map((r) => r.q.id)
  if (action === 'publish') {
    eligible = []
    for (const r of rows) {
      const reasons = readinessOf(r.q, r.scoringType === 'objective')
      if (reasons.length) skipped.push({ id: r.q.id, reasons })
      else eligible.push(r.q.id)
    }
  }

  const status = action === 'publish' ? 'published' : action === 'archive' ? 'archived' : 'draft'
  const updated = eligible.length
    ? await db
        .update(questions)
        .set({ status, updatedAt: new Date() })
        .where(inArray(questions.id, eligible))
        .returning({ id: questions.id })
    : []
  return { updated: updated.length, skipped }
}

/** Distinct topics in use, for the editor's suggestions and the list filter. */
export async function listTopics(): Promise<string[]> {
  const rows = await db.selectDistinct({ topic: questions.topic }).from(questions)
  return rows
    .map((r) => r.topic)
    .filter((t): t is string => Boolean(t))
    .sort()
}
