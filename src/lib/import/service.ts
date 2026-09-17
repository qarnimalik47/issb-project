/**
 * PDF import orchestration: create a batch, store the file, enqueue parsing,
 * and (in the worker) extract to the staging area with content-hash dedup.
 * Nothing enters the live question bank without explicit admin approval.
 */
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { importBatches, stagingQuestions, questions } from '../db/schema/content'
import { storage } from '../storage/index'
import { enqueue, QUEUE_NAMES } from '../queue/index'
import { parsePdf } from './pdf'
import { childLogger } from '../logger/index'

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

  await enqueue(QUEUE_NAMES.pdfImport, 'parse', { batchId: id }, { jobId: `pdf-import:${id}` })
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

    // Dedup against the live bank by content hash.
    const hashes = report.questions.map((q) => q.contentHash)
    const existing =
      hashes.length > 0
        ? await db
            .select({ h: questions.contentHash })
            .from(questions)
            .where(inArray(questions.contentHash, hashes))
        : []
    const existingSet = new Set(existing.map((e) => e.h))

    const seen = new Set<string>()
    let inserted = 0
    let duplicates = 0
    for (const q of report.questions) {
      if (existingSet.has(q.contentHash) || seen.has(q.contentHash)) {
        duplicates++
        continue
      }
      seen.add(q.contentHash)
      await db.insert(stagingQuestions).values({
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
      inserted++
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

/** Approve a staging item → insert into the live questions table (as draft). */
export async function approveStagingItem(id: string, adminId: string): Promise<string> {
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
  const extracted = item.extracted as {
    stemEn: string
    options: { key: string; textEn: string }[]
    correctOption: string | null
    explanation: string | null
  }

  const testTypeId = batch?.testTypeId
  if (!testTypeId) throw new Error('batch has no test type; set it before approving')

  const [q] = await db
    .insert(questions)
    .values({
      testTypeId,
      stemEn: extracted.stemEn,
      options: extracted.options,
      correctOption: extracted.correctOption,
      explanationEn: extracted.explanation,
      contentHash: item.contentHash,
      status: 'draft',
      createdBy: adminId,
    })
    .onConflictDoNothing({ target: questions.contentHash })
    .returning({ id: questions.id })

  await db
    .update(stagingQuestions)
    .set({ status: 'approved', reviewedBy: adminId })
    .where(eq(stagingQuestions.id, id))

  return q?.id ?? 'duplicate'
}

export async function rejectStagingItem(id: string, adminId: string): Promise<void> {
  await db
    .update(stagingQuestions)
    .set({ status: 'rejected', reviewedBy: adminId })
    .where(eq(stagingQuestions.id, id))
}
