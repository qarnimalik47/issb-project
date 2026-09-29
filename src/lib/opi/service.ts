/**
 * OPI sittings, stored as ordinary `attempts` rows of the `opi` test type:
 *
 *   in_progress  autosave = { answers }         — resumable across devices
 *   evaluated    config   = { version, answers, result }
 *
 * No deadline: the real inventory is untimed, and the stale-attempt sweeper
 * only touches rows with one. Score stays null so percentage-based analytics
 * (dashboard average, practice "last score") ignore it.
 */
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index'
import { attempts } from '../db/schema/attempts'
import { testTypes } from '../db/schema/content'
import { ApiError } from '../api/errors'
import { isUniqueViolation } from '../db/errors'
import { OPI_ITEM_BY_ID, OPI_VERSION } from './items'
import { isValidAnswer, missingItems, scoreOpi, type OpiAnswers, type OpiResult } from './score'

type Stored = { version: string; answers: OpiAnswers; result: OpiResult }

async function opiTypeId(): Promise<string> {
  const [tt] = await db
    .select({ id: testTypes.id })
    .from(testTypes)
    .where(eq(testTypes.code, 'opi'))
    .limit(1)
  if (!tt) throw new ApiError('not_found', 'The OPI test is not set up yet')
  return tt.id
}

/** Keep only known items with a 1–7 answer. */
function clean(answers: Record<string, unknown>): OpiAnswers {
  const out: OpiAnswers = {}
  for (const [id, v] of Object.entries(answers)) {
    if (OPI_ITEM_BY_ID.has(id) && isValidAnswer(v)) out[id] = v
  }
  return out
}

async function activeAttempt(userId: string, typeId: string) {
  const [row] = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, typeId),
        eq(attempts.status, 'in_progress'),
      ),
    )
    .limit(1)
  return row ?? null
}

export type OpiHistoryEntry = { id: string; code: string; variant: string; takenAt: Date }

export async function getOpiState(userId: string) {
  const typeId = await opiTypeId()
  const active = await activeAttempt(userId, typeId)
  const done = await db
    .select({ id: attempts.id, config: attempts.config, submittedAt: attempts.submittedAt })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, typeId),
        eq(attempts.status, 'evaluated'),
      ),
    )
    .orderBy(desc(attempts.submittedAt))
    .limit(20)
  const history: OpiHistoryEntry[] = done.flatMap((d) => {
    const r = (d.config as Stored | null)?.result
    return r ? [{ id: d.id, code: r.code, variant: r.variant, takenAt: d.submittedAt! }] : []
  })
  return {
    answers: clean(
      ((active?.autosave ?? {}) as { answers?: Record<string, unknown> }).answers ?? {},
    ),
    startedAt: active?.startedAt ?? null,
    history,
  }
}

/** Create the in-progress sitting if needed; tolerate a double-click race. */
async function ensureActive(userId: string, typeId: string) {
  const existing = await activeAttempt(userId, typeId)
  if (existing) return existing
  try {
    const [row] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId: typeId,
        mode: 'typed',
        status: 'in_progress',
        autosave: { answers: {} },
      })
      .returning()
    return row!
  } catch (err) {
    if (!isUniqueViolation(err)) throw err
    const again = await activeAttempt(userId, typeId)
    if (!again) throw err
    return again
  }
}

/** Merge a batch of answers into the saved sitting. */
export async function saveOpiProgress(userId: string, answers: Record<string, unknown>) {
  const typeId = await opiTypeId()
  const row = await ensureActive(userId, typeId)
  const saved = ((row.autosave ?? {}) as { answers?: Record<string, unknown> }).answers ?? {}
  const merged = clean({ ...saved, ...answers })
  await db
    .update(attempts)
    .set({ autosave: { answers: merged }, updatedAt: new Date() })
    .where(eq(attempts.id, row.id))
  return { answered: Object.keys(merged).length }
}

/** Score and close the sitting. Every statement must be answered. */
export async function submitOpi(userId: string, answers: Record<string, unknown>) {
  const typeId = await opiTypeId()
  const row = await ensureActive(userId, typeId)
  const saved = ((row.autosave ?? {}) as { answers?: Record<string, unknown> }).answers ?? {}
  const final = clean({ ...saved, ...answers })
  const missing = missingItems(final)
  if (missing.length > 0) {
    throw new ApiError(
      'validation_failed',
      `Answer every statement first — ${missing.length} still blank`,
      { details: missing.map((id) => ({ path: id, message: 'unanswered' })) },
    )
  }
  const now = new Date()
  const durationSeconds = Math.max(1, Math.round((now.getTime() - row.startedAt.getTime()) / 1000))
  const result = scoreOpi(final, durationSeconds)
  await db
    .update(attempts)
    .set({
      status: 'evaluated',
      submittedAt: now,
      durationSeconds,
      config: { version: OPI_VERSION, answers: final, result } satisfies Stored,
      autosave: null,
      updatedAt: now,
    })
    .where(eq(attempts.id, row.id))
  return { id: row.id, result }
}

export async function getOpiResult(userId: string, attemptId: string) {
  const typeId = await opiTypeId()
  const [row] = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.id, attemptId),
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, typeId),
        eq(attempts.status, 'evaluated'),
      ),
    )
    .limit(1)
  const stored = row?.config as Stored | null | undefined
  if (!row || !stored?.result) throw new ApiError('not_found', 'Result not found')
  return { id: row.id, result: stored.result, takenAt: row.submittedAt ?? row.updatedAt }
}

/** Throw away an unfinished sitting and start clean. */
export async function restartOpi(userId: string) {
  const typeId = await opiTypeId()
  await db
    .update(attempts)
    .set({ status: 'abandoned', updatedAt: new Date() })
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, typeId),
        eq(attempts.status, 'in_progress'),
      ),
    )
}
