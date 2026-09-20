/**
 * Objective (MCQ) test attempt lifecycle: start, resume, autosave, submit,
 * result. All timing and scoring are server-authoritative (rule 1.5); the
 * client never receives the answer key before submission.
 */
import { and, asc, desc, eq, gt, inArray, isNull, lt, or } from 'drizzle-orm'
import { db } from '../db/index'
import { attempts, mcqResponses } from '../db/schema/attempts'
import { mediaAssets, questionBanks, questions, testTypes } from '../db/schema/content'
import { scoreMcq, weakTopics, type ScoringQuestion } from './scoring'
import { isUniqueViolation } from '../db/errors'
import { ApiError } from '../api/errors'
import { signedUrl } from '../storage/index'

/**
 * A submission arriving this long after the deadline still counts in full. It
 * absorbs network latency and the client's own auto-submit racing zero; beyond
 * it, only answers autosaved in time are scored.
 */
export const DEADLINE_GRACE_SECONDS = 30

/**
 * Figure URLs must outlive the test. `signedUrl` defaults to 300 s, which would
 * expire five minutes into a 30-minute test and strand the student on an
 * unanswerable question — so the TTL tracks the remaining time instead.
 */
const MEDIA_URL_SLACK_SECONDS = 900
const MEDIA_URL_MAX_SECONDS = 4 * 3600

export type PlayerMedia = {
  url: string
  mime: string
  width: number | null
  height: number | null
}

export type PlayerQuestion = {
  id: string
  stemEn: string
  stemUr: string | null
  options: { key: string; textEn: string; textUr?: string }[] | null
  mediaId: string | null
  media: PlayerMedia | null
  topic: string | null
  difficulty: string
}

export type PlayerAttempt = {
  id: string
  testTypeId: string
  /** The numbered set this attempt is running, when it was started from one. */
  bankId: string | null
  status: string
  questions: PlayerQuestion[]
  answers: Record<string, string>
  flags: string[]
  remainingSeconds: number | null
  deadlineAt: string | null
}

type AttemptConfig = { questionIds: string[] }
type AttemptRow = typeof attempts.$inferSelect

/** The autosave blob. Older rows hold `{ answers }` only, hence the defensive read. */
function readAutosave(raw: unknown): { answers: Record<string, string>; flags: string[] } {
  const blob = (raw ?? {}) as { answers?: unknown; flags?: unknown }
  const answers =
    blob.answers && typeof blob.answers === 'object' ? (blob.answers as Record<string, string>) : {}
  const flags = Array.isArray(blob.flags)
    ? blob.flags.filter((f): f is string => typeof f === 'string')
    : []
  return { answers, flags }
}

function configOf(attempt: AttemptRow): AttemptConfig {
  return (attempt.config ?? { questionIds: [] }) as AttemptConfig
}

/** True once the deadline plus grace has passed. Untimed attempts never expire. */
function isExpired(attempt: AttemptRow, now = Date.now()): boolean {
  if (!attempt.deadlineAt) return false
  return now > attempt.deadlineAt.getTime() + DEADLINE_GRACE_SECONDS * 1000
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Load an attempt's questions in their fixed server order, each with its figure (if any). */
async function loadQuestions(questionIds: string[], mediaTtlSeconds: number) {
  if (questionIds.length === 0) return []
  const rows = await db
    .select({
      q: questions,
      mediaKey: mediaAssets.storageKey,
      mediaMime: mediaAssets.mime,
      mediaMeta: mediaAssets.meta,
    })
    .from(questions)
    .leftJoin(mediaAssets, eq(questions.mediaId, mediaAssets.id))
    .where(inArray(questions.id, questionIds))

  const byId = new Map(rows.map((r) => [r.q.id, r]))
  return questionIds
    .map((id) => byId.get(id))
    .filter((r): r is (typeof rows)[number] => Boolean(r))
    .map((r) => {
      let media: PlayerMedia | null = null
      if (r.mediaKey && r.mediaMime) {
        const meta = (r.mediaMeta ?? {}) as { width?: unknown; height?: unknown }
        media = {
          url: signedUrl(r.mediaKey, mediaTtlSeconds),
          mime: r.mediaMime,
          width: typeof meta.width === 'number' ? meta.width : null,
          height: typeof meta.height === 'number' ? meta.height : null,
        }
      }
      return { ...r.q, media }
    })
}

function mediaTtlFor(remainingSeconds: number | null): number {
  if (remainingSeconds == null) return MEDIA_URL_MAX_SECONDS
  return Math.min(remainingSeconds + MEDIA_URL_SLACK_SECONDS, MEDIA_URL_MAX_SECONDS)
}

/**
 * The caller's in-progress attempt for a test type, ready for the player, or
 * null. An attempt whose deadline has passed is closed on the way — so a
 * student returning after time ran out gets a fresh start, not a dead clock.
 */
export async function findInProgressAttempt(
  userId: string,
  testTypeId: string,
): Promise<PlayerAttempt | null> {
  const [existing] = await db
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
  if (!existing) return null
  if (isExpired(existing)) {
    await closeExpiredAttempt(existing)
    return null
  }
  return getAttemptForPlayer(userId, existing.id)
}

/**
 * Start a new attempt, or resume the existing in-progress one (one active per test).
 *
 * With `bankId`, the attempt runs that numbered set in its stored order — this
 * is what makes "Test 3" the same 50 questions every time, and what lets the
 * set list mark it done afterwards. Without one, the old behaviour stands: a
 * random sample of `timing.itemCount` from the whole published pool.
 */
export async function startAttempt(
  userId: string,
  testTypeId: string,
  bankId?: string | null,
): Promise<PlayerAttempt> {
  const resumed = await findInProgressAttempt(userId, testTypeId)
  if (resumed) {
    // One active attempt per test type is an anti-cheat rule, so a second set
    // cannot be opened alongside the first. Say which one is blocking rather
    // than silently handing back a different test than the one clicked.
    if (bankId && resumed.bankId && resumed.bankId !== bankId) {
      throw new ApiError(
        'conflict',
        'Another test of this type is still in progress. Finish or abandon it first.',
      )
    }
    return resumed
  }

  const [tt] = await db.select().from(testTypes).where(eq(testTypes.id, testTypeId)).limit(1)
  if (!tt) throw new ApiError('bad_request', 'Unknown test type')
  if (tt.scoringType !== 'objective') {
    throw new ApiError('bad_request', 'This test type is not objective (MCQ)')
  }

  const timing = (tt.timing ?? {}) as { itemCount?: number; totalSeconds?: number }
  let chosen: string[]

  if (bankId) {
    const [bank] = await db
      .select({
        id: questionBanks.id,
        status: questionBanks.status,
        testTypeId: questionBanks.testTypeId,
      })
      .from(questionBanks)
      .where(eq(questionBanks.id, bankId))
      .limit(1)
    if (!bank || bank.testTypeId !== testTypeId) throw new ApiError('not_found', 'Unknown test set')
    if (bank.status !== 'published') {
      throw new ApiError('bad_request', 'This test set is not available yet')
    }
    const items = await db
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.bankId, bankId), eq(questions.status, 'published')))
      .orderBy(asc(questions.createdAt), asc(questions.id))
    if (items.length === 0)
      throw new ApiError('bad_request', 'This test set has no published questions')
    // Fixed order: a numbered set is the same test each time it is taken.
    chosen = items.map((i) => i.id)
  } else {
    const pool = await db
      .select({ id: questions.id })
      .from(questions)
      .where(and(eq(questions.testTypeId, testTypeId), eq(questions.status, 'published')))
    if (pool.length === 0) {
      throw new ApiError('bad_request', 'No published questions for this test yet')
    }
    const count =
      timing.itemCount && timing.itemCount > 0
        ? Math.min(timing.itemCount, pool.length)
        : pool.length
    chosen = shuffle(pool.map((p) => p.id)).slice(0, count)
  }

  const deadlineAt = timing.totalSeconds ? new Date(Date.now() + timing.totalSeconds * 1000) : null

  try {
    const [attempt] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId,
        bankId: bankId ?? null,
        mode: 'typed',
        status: 'in_progress',
        deadlineAt,
        config: { questionIds: chosen } satisfies AttemptConfig,
        autosave: { answers: {}, flags: [] },
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
  const remainingSeconds = attempt.deadlineAt
    ? Math.max(0, Math.round((attempt.deadlineAt.getTime() - Date.now()) / 1000))
    : null
  const rows = await loadQuestions(configOf(attempt).questionIds, mediaTtlFor(remainingSeconds))

  // Strip the answer key: only these fields ever reach the client.
  const player: PlayerQuestion[] = rows.map((r) => ({
    id: r.id,
    stemEn: r.stemEn,
    stemUr: r.stemUr,
    options: r.options as PlayerQuestion['options'],
    mediaId: r.mediaId,
    media: r.media,
    topic: r.topic,
    difficulty: r.difficulty,
  }))

  const saved = readAutosave(attempt.autosave)
  return {
    id: attempt.id,
    testTypeId: attempt.testTypeId,
    bankId: attempt.bankId,
    status: attempt.status,
    questions: player,
    answers: saved.answers,
    flags: saved.flags,
    remainingSeconds,
    deadlineAt: attempt.deadlineAt?.toISOString() ?? null,
  }
}

/**
 * Persist partial answers (and, when sent, flags). Returns `closed` when the
 * attempt no longer accepts writes — submitted, or past its deadline — so the
 * client knows to stop saving and submit.
 *
 * `flags` omitted means "unchanged": the stored flags are merged back rather
 * than wiped, because the blob is rewritten whole.
 */
export async function saveAutosave(
  userId: string,
  attemptId: string,
  answers: Record<string, string>,
  integrityEvent?: { type: string; at: number },
  flags?: string[],
): Promise<'saved' | 'closed'> {
  const attempt = await loadOwnedAttempt(userId, attemptId)
  if (attempt.status !== 'in_progress' || isExpired(attempt)) return 'closed'

  const stored = readAutosave(attempt.autosave)
  const inAttempt = new Set(configOf(attempt).questionIds)
  const nextFlags =
    flags === undefined ? stored.flags : [...new Set(flags)].filter((id) => inAttempt.has(id))

  const events = (attempt.integrityEvents ?? []) as unknown[]
  await db
    .update(attempts)
    .set({
      autosave: { answers, flags: nextFlags },
      integrityEvents: integrityEvent ? [...events, integrityEvent].slice(-200) : events,
      updatedAt: new Date(),
    })
    .where(and(eq(attempts.id, attemptId), eq(attempts.status, 'in_progress')))
  return 'saved'
}

export type ResultMedia = { url: string; width: number | null; height: number | null }

export type AttemptResult = {
  attemptId: string
  score: number
  maxScore: number
  percentage: number
  weakTopics: string[]
  durationSeconds: number | null
  /** The deadline had passed, so only answers autosaved in time were scored. */
  expired: boolean
  items: {
    questionId: string
    stemEn: string
    stemUr: string | null
    options: PlayerQuestion['options']
    media: ResultMedia | null
    topic: string | null
    selected: string | null
    correctOption: string | null
    correct: boolean
    explanationEn: string | null
    explanationUr: string | null
  }[]
}

type LoadedQuestion = Awaited<ReturnType<typeof loadQuestions>>[number]

/**
 * Score and close an attempt. The status flip is the claim: it only succeeds
 * while the row is still in progress, so a double-click or the auto-submit
 * racing a manual one scores once and the loser reads the stored result.
 */
async function finalizeAttempt(
  attempt: AttemptRow,
  finalAnswers: Record<string, string>,
  expired: boolean,
): Promise<AttemptResult> {
  const ordered = await loadQuestions(configOf(attempt).questionIds, MEDIA_URL_MAX_SECONDS)
  const scoringQuestions: ScoringQuestion[] = ordered.map((r) => ({
    id: r.id,
    correctOption: r.correctOption,
    topic: r.topic,
  }))
  const result = scoreMcq(scoringQuestions, finalAnswers)

  // Time taken never exceeds the time allowed, even when closed late.
  const endMs = attempt.deadlineAt ? Math.min(Date.now(), attempt.deadlineAt.getTime()) : Date.now()
  const durationSeconds = Math.max(0, Math.round((endMs - attempt.startedAt.getTime()) / 1000))

  const claimed = await db.transaction(async (tx) => {
    const updated = await tx
      .update(attempts)
      .set({
        status: 'evaluated',
        submittedAt: new Date(),
        durationSeconds,
        score: String(result.score),
        maxScore: String(result.maxScore),
        updatedAt: new Date(),
      })
      .where(and(eq(attempts.id, attempt.id), eq(attempts.status, 'in_progress')))
      .returning({ id: attempts.id })
    if (updated.length === 0) return false

    // Persist per-question responses (deterministic, server-side).
    await tx.delete(mcqResponses).where(eq(mcqResponses.attemptId, attempt.id))
    if (result.perQuestion.length > 0) {
      await tx.insert(mcqResponses).values(
        result.perQuestion.map((pq, idx) => ({
          attemptId: attempt.id,
          questionId: pq.questionId,
          selectedOption: pq.selected,
          isCorrect: pq.correct,
          orderIndex: idx,
        })),
      )
    }
    return true
  })

  if (!claimed) return getResult(attempt.userId, attempt.id)
  return buildResult(attempt.id, ordered, result, durationSeconds, expired)
}

/**
 * Close an attempt whose time ran out without a submission — the equivalent of
 * the paper being collected. Answers autosaved in time are scored; an attempt
 * with nothing answered is marked abandoned instead, so opening a test and
 * walking away does not land a 0% in the student's history.
 */
async function closeExpiredAttempt(attempt: AttemptRow): Promise<void> {
  const { answers } = readAutosave(attempt.autosave)
  if (Object.values(answers).some(Boolean)) {
    await finalizeAttempt(attempt, answers, true)
    return
  }
  await db
    .update(attempts)
    .set({ status: 'abandoned', updatedAt: new Date() })
    .where(and(eq(attempts.id, attempt.id), eq(attempts.status, 'in_progress')))
}

/**
 * Close every timed attempt left in progress past its deadline. Resuming
 * already does this lazily per test; the sweep keeps history and analytics
 * honest for students who never come back.
 */
export async function sweepExpiredAttempts(limit = 500): Promise<number> {
  const cutoff = new Date(Date.now() - DEADLINE_GRACE_SECONDS * 1000)
  const stale = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.status, 'in_progress'), lt(attempts.deadlineAt, cutoff)))
    .limit(limit)
  // Written and interview attempts share the table; only MCQ attempts carry
  // a questionIds config and are scored here.
  const mcq = stale.filter((a) => Array.isArray((a.config as AttemptConfig | null)?.questionIds))
  for (const a of mcq) await closeExpiredAttempt(a)
  return mcq.length
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

  // Past the deadline the submission body is ignored — only answers autosaved
  // in time count. Without this the timer is display-only and trivially
  // bypassed by calling the API directly.
  const expired = isExpired(attempt)
  const saved = readAutosave(attempt.autosave).answers
  const finalAnswers = expired ? saved : { ...saved, ...answers }
  return finalizeAttempt(attempt, finalAnswers, expired)
}

function buildResult(
  attemptId: string,
  ordered: LoadedQuestion[],
  result: ReturnType<typeof scoreMcq>,
  durationSeconds: number | null,
  expired: boolean,
): AttemptResult {
  const perById = new Map(result.perQuestion.map((p) => [p.questionId, p]))
  return {
    attemptId,
    score: result.score,
    maxScore: result.maxScore,
    percentage: result.percentage,
    weakTopics: weakTopics(result.byTopic),
    durationSeconds,
    expired,
    items: ordered.map((r) => {
      const pq = perById.get(r.id)
      return {
        questionId: r.id,
        stemEn: r.stemEn,
        stemUr: r.stemUr,
        options: r.options as PlayerQuestion['options'],
        media: r.media ? { url: r.media.url, width: r.media.width, height: r.media.height } : null,
        topic: r.topic,
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
  const ordered = await loadQuestions(configOf(attempt).questionIds, MEDIA_URL_MAX_SECONDS)

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
  return buildResult(attemptId, ordered, result, attempt.durationSeconds, false)
}

/**
 * For the practice catalog: which test types have a resumable attempt, and the
 * latest score (percentage) per test type. An attempt past its deadline plus
 * grace is not resumable — opening it closes it — so it reads "Start".
 */
export async function getPracticeOverview(userId: string) {
  const cutoff = new Date(Date.now() - DEADLINE_GRACE_SECONDS * 1000)
  const running = await db
    .select({ testTypeId: attempts.testTypeId })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.status, 'in_progress'),
        or(isNull(attempts.deadlineAt), gt(attempts.deadlineAt, cutoff)),
      ),
    )

  const finished = await db
    .select({ testTypeId: attempts.testTypeId, score: attempts.score, maxScore: attempts.maxScore })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), eq(attempts.status, 'evaluated')))
    .orderBy(desc(attempts.submittedAt))
    .limit(200)
  const lastPercentage = new Map<string, number>()
  for (const f of finished) {
    if (lastPercentage.has(f.testTypeId) || !f.maxScore || Number(f.maxScore) === 0) continue
    lastPercentage.set(f.testTypeId, Math.round((Number(f.score) / Number(f.maxScore)) * 100))
  }

  return { resumable: new Set(running.map((r) => r.testTypeId)), lastPercentage }
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
