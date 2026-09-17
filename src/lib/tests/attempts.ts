/**
 * Objective (MCQ) test attempt lifecycle: start, resume, autosave, submit,
 * result. All timing and scoring are server-authoritative (rule 1.5); the
 * client never receives the answer key before submission.
 */
import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { attempts, mcqResponses } from '../db/schema/attempts'
import { questions, testTypes } from '../db/schema/content'
import { scoreMcq, weakTopics, type ScoringQuestion } from './scoring'
import { isUniqueViolation } from '../db/errors'
import { ApiError } from '../api/errors'

export type PlayerQuestion = {
  id: string
  stemEn: string
  stemUr: string | null
  options: { key: string; textEn: string; textUr?: string }[] | null
  mediaId: string | null
  topic: string | null
  difficulty: string
}

export type PlayerAttempt = {
  id: string
  testTypeId: string
  status: string
  questions: PlayerQuestion[]
  answers: Record<string, string>
  remainingSeconds: number | null
  deadlineAt: string | null
}

type AttemptConfig = { questionIds: string[] }

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Start a new attempt, or resume the existing in-progress one (one active per test). */
export async function startAttempt(userId: string, testTypeId: string): Promise<PlayerAttempt> {
  const existing = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, testTypeId),
        eq(attempts.status, 'in_progress'),
      ),
    )
    .limit(1)
  if (existing[0]) return getAttemptForPlayer(userId, existing[0].id)

  const [tt] = await db.select().from(testTypes).where(eq(testTypes.id, testTypeId)).limit(1)
  if (!tt) throw new ApiError('bad_request', 'Unknown test type')
  if (tt.scoringType !== 'objective') {
    throw new ApiError('bad_request', 'This test type is not objective (MCQ)')
  }

  const pool = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(eq(questions.testTypeId, testTypeId), eq(questions.status, 'published')))
  if (pool.length === 0) {
    throw new ApiError('bad_request', 'No published questions for this test yet')
  }

  const timing = (tt.timing ?? {}) as { itemCount?: number; totalSeconds?: number }
  const count =
    timing.itemCount && timing.itemCount > 0 ? Math.min(timing.itemCount, pool.length) : pool.length
  const chosen = shuffle(pool.map((p) => p.id)).slice(0, count)

  const deadlineAt = timing.totalSeconds ? new Date(Date.now() + timing.totalSeconds * 1000) : null

  try {
    const [attempt] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId,
        mode: 'typed',
        status: 'in_progress',
        deadlineAt,
        config: { questionIds: chosen } satisfies AttemptConfig,
        autosave: { answers: {} },
      })
      .returning()
    return getAttemptForPlayer(userId, attempt!.id)
  } catch (err) {
    // Unique violation on the "one active attempt per test" index (a concurrent
    // request won the race) → return the attempt that now exists.
    if (isUniqueViolation(err)) {
      const [ex] = await db
        .select()
        .from(attempts)
        .where(
          and(
            eq(attempts.userId, userId),
            eq(attempts.testTypeId, testTypeId),
            eq(attempts.status, 'in_progress'),
          ),
        )
        .limit(1)
      if (ex) return getAttemptForPlayer(userId, ex.id)
    }
    throw err
  }
}

async function loadOwnedAttempt(userId: string, attemptId: string) {
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1)
  if (!attempt) throw new Error('Attempt not found')
  return attempt
}

export async function getAttemptForPlayer(
  userId: string,
  attemptId: string,
): Promise<PlayerAttempt> {
  const attempt = await loadOwnedAttempt(userId, attemptId)
  const config = (attempt.config ?? { questionIds: [] }) as AttemptConfig
  const rows = config.questionIds.length
    ? await db.select().from(questions).where(inArray(questions.id, config.questionIds))
    : []

  // Preserve fixed server order; strip the answer key.
  const byId = new Map(rows.map((r) => [r.id, r]))
  const player: PlayerQuestion[] = config.questionIds
    .map((id) => byId.get(id))
    .filter((r): r is (typeof rows)[number] => Boolean(r))
    .map((r) => ({
      id: r.id,
      stemEn: r.stemEn,
      stemUr: r.stemUr,
      options: r.options as PlayerQuestion['options'],
      mediaId: r.mediaId,
      topic: r.topic,
      difficulty: r.difficulty,
    }))

  const autosave = (attempt.autosave ?? { answers: {} }) as { answers: Record<string, string> }
  const remainingSeconds = attempt.deadlineAt
    ? Math.max(0, Math.round((attempt.deadlineAt.getTime() - Date.now()) / 1000))
    : null

  return {
    id: attempt.id,
    testTypeId: attempt.testTypeId,
    status: attempt.status,
    questions: player,
    answers: autosave.answers ?? {},
    remainingSeconds,
    deadlineAt: attempt.deadlineAt?.toISOString() ?? null,
  }
}

export async function saveAutosave(
  userId: string,
  attemptId: string,
  answers: Record<string, string>,
  integrityEvent?: { type: string; at: number },
): Promise<void> {
  const attempt = await loadOwnedAttempt(userId, attemptId)
  if (attempt.status !== 'in_progress') return
  const events = (attempt.integrityEvents ?? []) as unknown[]
  await db
    .update(attempts)
    .set({
      autosave: { answers },
      integrityEvents: integrityEvent ? [...events, integrityEvent].slice(-200) : events,
      updatedAt: new Date(),
    })
    .where(eq(attempts.id, attemptId))
}

export type AttemptResult = {
  attemptId: string
  score: number
  maxScore: number
  percentage: number
  weakTopics: string[]
  items: {
    questionId: string
    stemEn: string
    stemUr: string | null
    options: PlayerQuestion['options']
    selected: string | null
    correctOption: string | null
    correct: boolean
    explanationEn: string | null
    explanationUr: string | null
  }[]
}

export async function submitAttempt(
  userId: string,
  attemptId: string,
  answers: Record<string, string>,
): Promise<AttemptResult> {
  const attempt = await loadOwnedAttempt(userId, attemptId)
  if (attempt.status !== 'in_progress') {
    return getResult(userId, attemptId)
  }
  const config = (attempt.config ?? { questionIds: [] }) as AttemptConfig

  // Merge autosaved answers with the final submission (submission wins).
  const saved = ((attempt.autosave ?? { answers: {} }) as { answers: Record<string, string> })
    .answers
  const finalAnswers = { ...saved, ...answers }

  const rows = config.questionIds.length
    ? await db.select().from(questions).where(inArray(questions.id, config.questionIds))
    : []
  const byId = new Map(rows.map((r) => [r.id, r]))
  const ordered = config.questionIds
    .map((id) => byId.get(id))
    .filter((r): r is (typeof rows)[number] => Boolean(r))

  const scoringQuestions: ScoringQuestion[] = ordered.map((r) => ({
    id: r.id,
    correctOption: r.correctOption,
    topic: r.topic,
  }))
  const result = scoreMcq(scoringQuestions, finalAnswers)

  // Persist per-question responses (deterministic, server-side).
  await db.delete(mcqResponses).where(eq(mcqResponses.attemptId, attemptId))
  if (result.perQuestion.length > 0) {
    await db.insert(mcqResponses).values(
      result.perQuestion.map((pq, idx) => ({
        attemptId,
        questionId: pq.questionId,
        selectedOption: pq.selected,
        isCorrect: pq.correct,
        orderIndex: idx,
      })),
    )
  }

  const durationSeconds = Math.round((Date.now() - attempt.startedAt.getTime()) / 1000)
  await db
    .update(attempts)
    .set({
      status: 'evaluated',
      submittedAt: new Date(),
      durationSeconds,
      score: String(result.score),
      maxScore: String(result.maxScore),
      updatedAt: new Date(),
    })
    .where(eq(attempts.id, attemptId))

  return buildResult(attemptId, ordered, result)
}

function buildResult(
  attemptId: string,
  ordered: {
    id: string
    stemEn: string
    stemUr: string | null
    options: unknown
    correctOption: string | null
    explanationEn: string | null
    explanationUr: string | null
  }[],
  result: ReturnType<typeof scoreMcq>,
): AttemptResult {
  const perById = new Map(result.perQuestion.map((p) => [p.questionId, p]))
  return {
    attemptId,
    score: result.score,
    maxScore: result.maxScore,
    percentage: result.percentage,
    weakTopics: weakTopics(result.byTopic),
    items: ordered.map((r) => {
      const pq = perById.get(r.id)
      return {
        questionId: r.id,
        stemEn: r.stemEn,
        stemUr: r.stemUr,
        options: r.options as PlayerQuestion['options'],
        selected: pq?.selected ?? null,
        correctOption: r.correctOption,
        correct: pq?.correct ?? false,
        explanationEn: r.explanationEn,
        explanationUr: r.explanationUr,
      }
    }),
  }
}

export async function getResult(userId: string, attemptId: string): Promise<AttemptResult> {
  const attempt = await loadOwnedAttempt(userId, attemptId)
  if (attempt.status !== 'evaluated') throw new Error('Attempt not yet submitted')
  const config = (attempt.config ?? { questionIds: [] }) as AttemptConfig

  const rows = config.questionIds.length
    ? await db.select().from(questions).where(inArray(questions.id, config.questionIds))
    : []
  const byId = new Map(rows.map((r) => [r.id, r]))
  const ordered = config.questionIds
    .map((id) => byId.get(id))
    .filter(Boolean) as (typeof rows)[number][]

  const responses = await db
    .select()
    .from(mcqResponses)
    .where(eq(mcqResponses.attemptId, attemptId))
  const answers: Record<string, string> = {}
  for (const r of responses) if (r.selectedOption) answers[r.questionId] = r.selectedOption

  const result = scoreMcq(
    ordered.map((r) => ({ id: r.id, correctOption: r.correctOption, topic: r.topic })),
    answers,
  )
  return buildResult(attemptId, ordered, result)
}

/** Per-topic accuracy across the user's evaluated attempts of a test type. */
export async function getTopicAnalytics(userId: string, testTypeId?: string) {
  const conds = [eq(attempts.userId, userId), eq(attempts.status, 'evaluated')]
  if (testTypeId) conds.push(eq(attempts.testTypeId, testTypeId))
  const userAttempts = await db
    .select({ id: attempts.id })
    .from(attempts)
    .where(and(...conds))
    .orderBy(desc(attempts.submittedAt))
    .limit(50)
  const attemptIds = userAttempts.map((a) => a.id)
  if (attemptIds.length === 0)
    return { byTopic: {} as Record<string, { correct: number; total: number }> }

  const responses = await db
    .select({ questionId: mcqResponses.questionId, isCorrect: mcqResponses.isCorrect })
    .from(mcqResponses)
    .where(inArray(mcqResponses.attemptId, attemptIds))

  const qIds = [...new Set(responses.map((r) => r.questionId))]
  const qRows = qIds.length
    ? await db
        .select({ id: questions.id, topic: questions.topic })
        .from(questions)
        .where(inArray(questions.id, qIds))
    : []
  const topicById = new Map(qRows.map((q) => [q.id, q.topic?.trim() || 'general']))

  const byTopic: Record<string, { correct: number; total: number }> = {}
  for (const r of responses) {
    const topic = topicById.get(r.questionId) ?? 'general'
    const b = (byTopic[topic] ??= { correct: 0, total: 0 })
    b.total++
    if (r.isCorrect) b.correct++
  }
  return { byTopic }
}
