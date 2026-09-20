/**
 * PDF import orchestration: create a batch, store the file, enqueue parsing,
 * and (in the worker) extract to the staging area with content-hash dedup.
 * Nothing enters the live question bank without explicit admin approval.
 */
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import {
  importBatches,
  stagingQuestions,
  questions,
  sourceDocuments,
  testTypes,
} from '../db/schema/content'
import { storage } from '../storage/index'
import { enqueue, QUEUE_NAMES } from '../queue/index'
import { parsePdf } from './pdf'
import { childLogger } from '../logger/index'
import { ApiError } from '../api/errors'
import { optionProblems, publishReadiness } from '../content/readiness'
import { isSufficientlyRewritten, rewriteSimilarity } from '../content/similarity'
import { questionContentHash } from './parse'

const log = childLogger('pdf-import')

export type CreateBatchInput = {
  filename: string
  source: 'upload' | 'path'
  testTypeId?: string | null
  createdBy: string
  data: Buffer
}

export async function createImportBatch(input: CreateBatchInput): Promise<string> {
  const [batch] = await db
    .insert(importBatches)
    .values({
      source: input.source,
      filename: input.filename,
      status: 'parsing',
      testTypeId: input.testTypeId ?? null,
      createdBy: input.createdBy,
    })
    .returning({ id: importBatches.id })

  const id = batch!.id
  const storageKey = `imports/${id}/${input.filename}`
  await storage.put(storageKey, input.data, { mime: 'application/pdf' })
  await db.update(importBatches).set({ meta: { storageKey } }).where(eq(importBatches.id, id))

  await enqueue(QUEUE_NAMES.pdfImport, 'parse', { batchId: id }, { jobId: `pdf-import_${id}` })
  return id
}

/** Worker step: parse the batch's PDF and populate staging with dedup. */
export async function processImportBatch(batchId: string): Promise<void> {
  const [batch] = await db
    .select()
    .from(importBatches)
    .where(eq(importBatches.id, batchId))
    .limit(1)
  if (!batch) throw new Error(`import batch ${batchId} not found`)

  const meta = (batch.meta ?? {}) as { storageKey?: string }
  if (!meta.storageKey) throw new Error('batch has no stored file')

  try {
    const buffer = await storage.get(meta.storageKey)
    const report = await parsePdf(buffer)

    // Dedup against the live bank AND anything already waiting in review —
    // without the second check, overlapping uploads staged the same question
    // twice. The partial unique index on pending hashes backs this up.
    const hashes = report.questions.map((q) => q.contentHash)
    const [live, pending] =
      hashes.length > 0
        ? await Promise.all([
            db
              .select({ h: questions.contentHash })
              .from(questions)
              .where(inArray(questions.contentHash, hashes)),
            db
              .select({ h: stagingQuestions.contentHash })
              .from(stagingQuestions)
              .where(
                and(
                  inArray(stagingQuestions.contentHash, hashes),
                  eq(stagingQuestions.status, 'pending'),
                ),
              ),
          ])
        : [[], []]
    const existingSet = new Set([...live, ...pending].map((e) => e.h))

    const seen = new Set<string>()
    let inserted = 0
    let duplicates = 0
    for (const q of report.questions) {
      if (existingSet.has(q.contentHash) || seen.has(q.contentHash)) {
        duplicates++
        continue
      }
      seen.add(q.contentHash)
      const [row] = await db
        .insert(stagingQuestions)
        .values({
          batchId,
          page: q.page,
          extracted: {
            stemEn: q.stemEn,
            options: q.options,
            correctOption: q.correctOption,
            explanation: q.explanation,
          },
          contentHash: q.contentHash,
          confidence: String(q.confidence),
          status: 'pending',
        })
        // A concurrent import staged it first: a duplicate, not a failure.
        .onConflictDoNothing()
        .returning({ id: stagingQuestions.id })
      if (row) inserted++
      else duplicates++
    }

    const failedPages = report.pages.filter((p) => !p.ok)
    await db
      .update(importBatches)
      .set({
        status: 'ready',
        totalPages: report.totalPages,
        meta: {
          ...meta,
          inserted,
          duplicates,
          lowConfidence: report.questions.filter((q) => q.confidence < 0.6).length,
          failedPages: failedPages.map((p) => ({ page: p.page, error: p.ok ? '' : p.error })),
        },
      })
      .where(eq(importBatches.id, batchId))

    log.info({ batchId, inserted, duplicates, failed: failedPages.length }, 'import parsed')
  } catch (err) {
    log.error({ err, batchId }, 'import failed')
    await db
      .update(importBatches)
      .set({
        status: 'failed',
        meta: { ...meta, error: err instanceof Error ? err.message : 'error' },
      })
      .where(eq(importBatches.id, batchId))
    throw err
  }
}

/**
 * Set (or change) the test type of an import batch. A batch uploaded without
 * one could otherwise never be approved — approval needs to know which test
 * the questions belong to. PDF imports carry MCQs, so only objective types fit.
 */
export async function setBatchTestType(batchId: string, testTypeId: string): Promise<void> {
  const [tt] = await db.select().from(testTypes).where(eq(testTypes.id, testTypeId)).limit(1)
  if (!tt) throw new ApiError('validation_failed', 'Unknown test type')
  if (tt.scoringType !== 'objective') {
    throw new ApiError(
      'validation_failed',
      'Imported questions are MCQs; pick an objective test type',
    )
  }
  const updated = await db
    .update(importBatches)
    .set({ testTypeId })
    .where(eq(importBatches.id, batchId))
    .returning({ id: importBatches.id })
  if (updated.length === 0) throw new ApiError('not_found', 'Import batch not found')
}

export type ApproveResult = {
  /** The live question, or null when an identical question already existed. */
  questionId: string | null
  duplicate: boolean
  published: boolean
}

type Extracted = {
  stemEn: string
  stemUr?: string | null
  options: { key: string; textEn: string; textUr?: string }[]
  correctOption: string | null
  explanation: string | null
  explanationUr?: string | null
}

const REWRITE_REQUIRED =
  'This question came from a third-party site. Rewrite it in your own words before approving.'

/**
 * Approve a staging item into the live bank — as a draft by default, or
 * published when `publish` is set and the item passes the same readiness check
 * as every other publish path. A failed check leaves it pending.
 *
 * The rewrite gate is enforced HERE, not merely in the UI, so the API cannot
 * be driven around it: `needs_rewrite` items are refused, and `rewritten`
 * ones are re-measured against the source before they pass.
 */
export async function approveStagingItem(
  id: string,
  adminId: string,
  opts: { publish?: boolean } = {},
): Promise<ApproveResult> {
  const [item] = await db
    .select()
    .from(stagingQuestions)
    .where(and(eq(stagingQuestions.id, id), eq(stagingQuestions.status, 'pending')))
    .limit(1)
  if (!item) throw new Error('staging item not found or already reviewed')

  const [batch] = await db
    .select()
    .from(importBatches)
    .where(eq(importBatches.id, item.batchId))
    .limit(1)
  const extracted = item.extracted as Extracted
  const edited = item.editedExtracted as Extracted | null

  if (item.reviewState === 'needs_rewrite') throw new ApiError('conflict', REWRITE_REQUIRED)
  if (item.reviewState === 'rewritten') {
    const similarity = edited
      ? rewriteSimilarity(
          { stemEn: extracted.stemEn, explanation: extracted.explanation },
          { stemEn: edited.stemEn, explanation: edited.explanation },
        )
      : 1
    if (!isSufficientlyRewritten(similarity)) throw new ApiError('conflict', REWRITE_REQUIRED)
  }

  const testTypeId = batch?.testTypeId
  if (!testTypeId) throw new Error('batch has no test type; set it before approving')

  // What goes live is the reviewer's version when there is one.
  const final = edited ?? extracted
  if (opts.publish) {
    const reasons = publishReadiness({
      stemEn: final.stemEn,
      options: final.options,
      correctOption: final.correctOption,
      objective: true,
    })
    if (reasons.length) {
      throw new ApiError('validation_failed', `Not ready to publish: ${reasons.join('; ')}`, {
        details: reasons.map((message) => ({ path: 'status', message })),
      })
    }
  }

  // Licences that require credit get it appended to the explanation.
  let explanationEn = final.explanation
  if (item.sourceDocumentId) {
    const [doc] = await db
      .select({ licence: sourceDocuments.licence, attribution: sourceDocuments.attribution })
      .from(sourceDocuments)
      .where(eq(sourceDocuments.id, item.sourceDocumentId))
      .limit(1)
    if (doc?.licence === 'cc_by' && doc.attribution) {
      explanationEn = [explanationEn, `Source: ${doc.attribution}`].filter(Boolean).join('\n\n')
    }
  }

  const [q] = await db
    .insert(questions)
    .values({
      testTypeId,
      stemEn: final.stemEn,
      stemUr: final.stemUr || null,
      options: final.options,
      correctOption: final.correctOption,
      explanationEn,
      explanationUr: final.explanationUr || null,
      // Hash what actually goes live. Reusing the staging hash would stamp a
      // rewritten question with the SOURCE text's hash, so rewrites would
      // false-collide and dedup would compare against the wrong text.
      contentHash: questionContentHash(final.stemEn, final.options),
      sourceDocumentId: item.sourceDocumentId,
      status: opts.publish ? 'published' : 'draft',
      createdBy: adminId,
    })
    .onConflictDoNothing({ target: questions.contentHash })
    .returning({ id: questions.id, status: questions.status })

  await db
    .update(stagingQuestions)
    .set({ status: 'approved', reviewedBy: adminId })
    .where(eq(stagingQuestions.id, id))

  return {
    questionId: q?.id ?? null,
    duplicate: !q,
    published: q?.status === 'published',
  }
}

/**
 * Save a reviewer's edit of a staged item. `extracted` is never touched — it
 * stays the record of what the source said. For items under the rewrite gate
 * the similarity to the source prose is measured here, on the server, and
 * decides whether the item becomes `rewritten` (approvable) or stays
 * `needs_rewrite`. The edit is saved either way, so no work is lost.
 */
export async function saveStagingEdit(id: string, edit: Extracted) {
  const [item] = await db
    .select()
    .from(stagingQuestions)
    .where(and(eq(stagingQuestions.id, id), eq(stagingQuestions.status, 'pending')))
    .limit(1)
  if (!item) throw new ApiError('not_found', 'Staged item not found or already reviewed')
  const problems = optionProblems(edit.options, edit.correctOption)
  if (problems.length) throw new ApiError('validation_failed', problems[0]!)

  const extracted = item.extracted as Extracted
  const similarity = rewriteSimilarity(
    { stemEn: extracted.stemEn, explanation: extracted.explanation },
    { stemEn: edit.stemEn, explanation: edit.explanation },
  )
  const gated = item.reviewState !== 'clear'
  const reviewState = gated
    ? isSufficientlyRewritten(similarity)
      ? ('rewritten' as const)
      : ('needs_rewrite' as const)
    : ('clear' as const)

  await db
    .update(stagingQuestions)
    .set({ editedExtracted: edit, similarity: String(similarity), reviewState })
    .where(eq(stagingQuestions.id, id))
  return { reviewState, similarity }
}

export async function rejectStagingItem(id: string, adminId: string): Promise<void> {
  await db
    .update(stagingQuestions)
    .set({ status: 'rejected', reviewedBy: adminId })
    .where(eq(stagingQuestions.id, id))
}
