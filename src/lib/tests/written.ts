/**
 * Written test capture lifecycle (Phase 4 — capture only, no AI yet).
 * Supports typed and paper (photo + OCR) modes with per-item timing metadata
 * and robust autosave. AI evaluation of these responses arrives in Phase 5.
 */
import { and, asc, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { attempts, writtenResponses } from '../db/schema/attempts'
import { questionBanks, questions, testTypes, mediaAssets } from '../db/schema/content'
import { ApiError } from '../api/errors'
import { isUniqueViolation } from '../db/errors'
import { storage } from '../storage/index'
import { enqueue, QUEUE_NAMES } from '../queue/index'
import { getOcrAdapter } from '../ocr/index'
import { getSttAdapter } from '../stt/index'

export type WrittenItem = {
  ref: string
  questionId: string
  prompt: string
  promptUr: string | null
}

export type WrittenResponseView = {
  ref: string
  text: string | null
  ocrText: string | null
  ocrConfirmed: boolean
  hasImage: boolean
}

export type WrittenAttemptView = {
  id: string
  testTypeId: string
  status: string
  mode: string
  timing: Record<string, number>
  items: WrittenItem[]
  responses: Record<string, WrittenResponseView>
  remainingSeconds: number | null
}

type WrittenConfig = { items: WrittenItem[]; timing: Record<string, number> }

/**
 * Start (or resume) a written attempt.
 *
 * With `bankId`, the attempt runs that numbered set in its stored order, so a
 * WAT or SCT set is the same items each sitting and can be marked done. Without
 * one, the whole published pool is used, capped at `timing.itemCount`.
 */
export async function startWrittenAttempt(
  userId: string,
  testTypeId: string,
  mode: 'typed' | 'paper',
  bankId?: string | null,
): Promise<WrittenAttemptView> {
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
  if (existing[0]) {
    // Same rule as the MCQ player: one active attempt per test type, so name
    // the set that is blocking instead of quietly running a different one.
    if (bankId && existing[0].bankId && existing[0].bankId !== bankId) {
      throw new ApiError(
        'conflict',
        'Another test of this type is still in progress. Finish or abandon it first.',
      )
    }
    return getWrittenAttempt(userId, existing[0].id)
  }

  const [tt] = await db.select().from(testTypes).where(eq(testTypes.id, testTypeId)).limit(1)
  if (!tt) throw new ApiError('bad_request', 'Unknown test type')
  if (tt.scoringType !== 'rubric') {
    throw new ApiError('bad_request', 'This test type is not a written (rubric) test')
  }

  let pool: { id: string; stemEn: string; stemUr: string | null }[]
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
    pool = await db
      .select({ id: questions.id, stemEn: questions.stemEn, stemUr: questions.stemUr })
      .from(questions)
      .where(and(eq(questions.bankId, bankId), eq(questions.status, 'published')))
      .orderBy(asc(questions.createdAt), asc(questions.id))
  } else {
    pool = await db
      .select({ id: questions.id, stemEn: questions.stemEn, stemUr: questions.stemUr })
      .from(questions)
      .where(and(eq(questions.testTypeId, testTypeId), eq(questions.status, 'published')))
  }
  if (pool.length === 0) throw new ApiError('bad_request', 'No published items for this test yet')

  const timing = (tt.timing ?? {}) as Record<string, number>
  // A numbered set is already the right length; only the free pool needs capping.
  const count = bankId
    ? pool.length
    : timing.itemCount && timing.itemCount > 0
      ? Math.min(timing.itemCount, pool.length)
      : pool.length
  const items: WrittenItem[] = pool.slice(0, count).map((q, i) => ({
    ref: String(i),
    questionId: q.id,
    prompt: q.stemEn,
    promptUr: q.stemUr,
  }))

  // Overall guard deadline: explicit total, or per-item * count for WAT-style.
  const totalSeconds =
    timing.totalSeconds ??
    (timing.perItemSeconds ? timing.perItemSeconds * count : undefined) ??
    (timing.writeSeconds ? (timing.writeSeconds + (timing.viewSeconds ?? 0)) * count : undefined)
  const deadlineAt = totalSeconds ? new Date(Date.now() + totalSeconds * 1000) : null

  try {
    const [attempt] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId,
        bankId: bankId ?? null,
        mode,
        status: 'in_progress',
        deadlineAt,
        config: { items, timing } satisfies WrittenConfig,
      })
      .returning()
    return getWrittenAttempt(userId, attempt!.id)
  } catch (err) {
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
      if (ex) return getWrittenAttempt(userId, ex.id)
    }
    throw err
  }
}

async function loadOwned(userId: string, attemptId: string) {
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1)
  if (!attempt) throw new ApiError('not_found', 'Attempt not found')
  return attempt
}

export async function getWrittenAttempt(
  userId: string,
  attemptId: string,
): Promise<WrittenAttemptView> {
  const attempt = await loadOwned(userId, attemptId)
  const config = (attempt.config ?? { items: [], timing: {} }) as WrittenConfig
  const rows = await db
    .select()
    .from(writtenResponses)
    .where(eq(writtenResponses.attemptId, attemptId))
  const responses: Record<string, WrittenResponseView> = {}
  for (const r of rows) {
    responses[r.itemRef] = {
      ref: r.itemRef,
      text: r.responseText,
      ocrText: r.ocrText,
      ocrConfirmed: r.ocrConfirmed,
      hasImage: r.imageMediaId != null,
    }
  }
  const remainingSeconds = attempt.deadlineAt
    ? Math.max(0, Math.round((attempt.deadlineAt.getTime() - Date.now()) / 1000))
    : null
  return {
    id: attempt.id,
    testTypeId: attempt.testTypeId,
    status: attempt.status,
    mode: attempt.mode,
    timing: config.timing,
    items: config.items,
    responses,
    remainingSeconds,
  }
}

function assertItem(config: WrittenConfig, ref: string) {
  if (!config.items.some((i) => i.ref === ref)) throw new ApiError('bad_request', 'Unknown item')
}

export async function saveWritten(
  userId: string,
  attemptId: string,
  ref: string,
  text: string,
  timingMeta?: Record<string, number>,
): Promise<void> {
  const attempt = await loadOwned(userId, attemptId)
  if (attempt.status !== 'in_progress') return
  const config = (attempt.config ?? { items: [], timing: {} }) as WrittenConfig
  assertItem(config, ref)
  const item = config.items.find((i) => i.ref === ref)!

  await db
    .insert(writtenResponses)
    .values({ attemptId, itemRef: ref, prompt: item.prompt, responseText: text, timingMeta })
    .onConflictDoUpdate({
      target: [writtenResponses.attemptId, writtenResponses.itemRef],
      set: { responseText: text, timingMeta, updatedAt: new Date() },
    })
}

export async function uploadAnswerSheet(
  userId: string,
  attemptId: string,
  ref: string,
  image: Buffer,
  mime: string,
): Promise<void> {
  const attempt = await loadOwned(userId, attemptId)
  const config = (attempt.config ?? { items: [], timing: {} }) as WrittenConfig
  assertItem(config, ref)
  const item = config.items.find((i) => i.ref === ref)!

  const storageKey = `answers/${attemptId}/${ref}-${Date.now()}`
  await storage.put(storageKey, image, { mime })
  const [media] = await db
    .insert(mediaAssets)
    .values({ kind: 'answer_sheet', storageKey, mime, sizeBytes: image.length, createdBy: userId })
    .returning({ id: mediaAssets.id })

  const [wr] = await db
    .insert(writtenResponses)
    .values({ attemptId, itemRef: ref, prompt: item.prompt, imageMediaId: media!.id })
    .onConflictDoUpdate({
      target: [writtenResponses.attemptId, writtenResponses.itemRef],
      set: { imageMediaId: media!.id, ocrConfirmed: false, updatedAt: new Date() },
    })
    .returning({ id: writtenResponses.id })

  // OCR runs in the background, never in this request (rule 1.4).
  await enqueue(
    QUEUE_NAMES.ocr,
    'recognize',
    { writtenResponseId: wr!.id, storageKey, mime },
    { jobId: `ocr_${wr!.id}` },
  )
}

/** Worker step: run OCR on an uploaded answer sheet and store the extracted text. */
export async function processOcr(writtenResponseId: string, storageKey: string): Promise<void> {
  const image = await storage.get(storageKey)
  const adapter = getOcrAdapter()
  const result = await adapter.recognize(image, { lang: 'mixed' })
  await db
    .update(writtenResponses)
    .set({ ocrText: result.text, updatedAt: new Date() })
    .where(eq(writtenResponses.id, writtenResponseId))
}

/**
 * Voice mode (Phase 7): upload a recorded answer. Stored as a 'voice' media
 * asset; STT runs in the background and fills the transcript for the user to
 * confirm — reusing the same confirm flow as OCR.
 */
export async function uploadAudio(
  userId: string,
  attemptId: string,
  ref: string,
  audio: Buffer,
  mime: string,
  durationSec?: number,
): Promise<void> {
  const attempt = await loadOwned(userId, attemptId)
  const config = (attempt.config ?? { items: [], timing: {} }) as WrittenConfig
  assertItem(config, ref)
  const item = config.items.find((i) => i.ref === ref)!

  const storageKey = `voice/${attemptId}/${ref}-${Date.now()}`
  await storage.put(storageKey, audio, { mime })
  const [media] = await db
    .insert(mediaAssets)
    .values({
      kind: 'voice',
      storageKey,
      mime,
      sizeBytes: audio.length,
      createdBy: userId,
      meta: { durationSec },
    })
    .returning({ id: mediaAssets.id })

  const [wr] = await db
    .insert(writtenResponses)
    .values({
      attemptId,
      itemRef: ref,
      prompt: item.prompt,
      imageMediaId: media!.id,
      timingMeta: durationSec ? { durationSec } : undefined,
    })
    .onConflictDoUpdate({
      target: [writtenResponses.attemptId, writtenResponses.itemRef],
      set: { imageMediaId: media!.id, ocrConfirmed: false, updatedAt: new Date() },
    })
    .returning({ id: writtenResponses.id })

  await enqueue(
    QUEUE_NAMES.stt,
    'transcribe',
    { writtenResponseId: wr!.id, storageKey },
    { jobId: `stt_${wr!.id}` },
  )
}

/** Worker step: transcribe an uploaded voice answer. */
export async function processStt(writtenResponseId: string, storageKey: string): Promise<void> {
  const audio = await storage.get(storageKey)
  const result = await getSttAdapter().transcribe(audio, { lang: 'mixed' })
  await db
    .update(writtenResponses)
    .set({ ocrText: result.text, updatedAt: new Date() })
    .where(eq(writtenResponses.id, writtenResponseId))
}

/** Mandatory user confirmation of OCR/STT text before it is used. */
export async function confirmOcr(
  userId: string,
  attemptId: string,
  ref: string,
  correctedText: string,
): Promise<void> {
  const attempt = await loadOwned(userId, attemptId)
  const config = (attempt.config ?? { items: [], timing: {} }) as WrittenConfig
  assertItem(config, ref)
  await db
    .update(writtenResponses)
    .set({ responseText: correctedText, ocrConfirmed: true, updatedAt: new Date() })
    .where(and(eq(writtenResponses.attemptId, attemptId), eq(writtenResponses.itemRef, ref)))
}

export async function submitWrittenAttempt(userId: string, attemptId: string): Promise<void> {
  const attempt = await loadOwned(userId, attemptId)
  if (attempt.status !== 'in_progress') return
  const durationSeconds = Math.round((Date.now() - attempt.startedAt.getTime()) / 1000)
  await db
    .update(attempts)
    .set({ status: 'submitted', submittedAt: new Date(), durationSeconds, updatedAt: new Date() })
    .where(eq(attempts.id, attemptId))
}

/** List the user's written responses across submitted attempts (for Phase 5 eval). */
export async function getSubmittedWrittenResponses(userId: string, testTypeId?: string) {
  const conds = [eq(attempts.userId, userId), eq(attempts.status, 'submitted')]
  if (testTypeId) conds.push(eq(attempts.testTypeId, testTypeId))
  const rows = await db
    .select({ id: attempts.id })
    .from(attempts)
    .where(and(...conds))
  const ids = rows.map((r) => r.id)
  if (ids.length === 0) return []
  return db.select().from(writtenResponses).where(inArray(writtenResponses.attemptId, ids))
}
