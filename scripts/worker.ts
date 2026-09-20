/**
 * Background worker process. Runs all BullMQ workers (rule 1.4: slow work runs
 * here, not in HTTP requests). Start with: npm run worker
 *
 * New processors are registered here as later phases add queues (OCR, STT, AI
 * evaluation, news ingestion).
 */
import 'dotenv/config'
import type { Worker } from 'bullmq'
import { createWorker, QUEUE_NAMES } from '../src/lib/queue/index'
import { processImportBatch } from '../src/lib/import/service'
import { processOcr, processStt } from '../src/lib/tests/written'
import { evaluateWrittenResponse } from '../src/lib/eval/service'
import {
  extractSourceDocument,
  fetchSourceDocument,
  markDocumentFailed,
} from '../src/lib/scrape/service'
import { DelayedError } from 'bullmq'
import { childLogger } from '../src/lib/logger/index'

const log = childLogger('worker')
const workers: Worker[] = []

workers.push(
  createWorker<{ batchId: string }>(QUEUE_NAMES.pdfImport, async (job) => {
    await processImportBatch(job.data.batchId)
  }),
)

workers.push(
  createWorker<{ writtenResponseId: string; storageKey: string }>(QUEUE_NAMES.ocr, async (job) => {
    await processOcr(job.data.writtenResponseId, job.data.storageKey)
  }),
)

workers.push(
  createWorker<{ writtenResponseId: string; storageKey: string }>(QUEUE_NAMES.stt, async (job) => {
    await processStt(job.data.writtenResponseId, job.data.storageKey)
  }),
)

workers.push(
  createWorker<{ writtenResponseId: string }>(QUEUE_NAMES.evaluation, async (job) => {
    await evaluateWrittenResponse(job.data.writtenResponseId)
  }),
)

// Scrape fetches: one request per second globally on top of the per-domain gap.
workers.push(
  createWorker<{ documentId: string }>(
    QUEUE_NAMES.scrapeFetch,
    async (job, token) => {
      const outcome = await fetchSourceDocument(job.data.documentId)
      if (outcome.kind === 'delay') {
        // Politeness gate or 429: come back later WITHOUT spending an attempt.
        await job.moveToDelayed(Date.now() + outcome.ms, token)
        throw new DelayedError()
      }
      if (outcome.kind === 'retry') {
        const attempts = job.opts.attempts ?? 1
        if (job.attemptsMade + 1 >= attempts) {
          await markDocumentFailed(job.data.documentId, outcome.reason)
          return
        }
        throw new Error(outcome.reason)
      }
    },
    { concurrency: 2, limiter: { max: 1, duration: 1000 } },
  ),
)

workers.push(
  createWorker<{ documentId: string }>(QUEUE_NAMES.scrapeExtract, async (job) => {
    await extractSourceDocument(job.data.documentId)
  }),
)

for (const w of workers) {
  w.on('completed', (job) => log.info({ queue: w.name, jobId: job.id }, 'job completed'))
  w.on('failed', (job, err) => log.error({ queue: w.name, jobId: job?.id, err }, 'job failed'))
}

log.warn(
  `✓ Worker started with ${workers.length} queue(s): ${workers.map((w) => w.name).join(', ')}`,
)

async function shutdown() {
  log.warn('shutting down workers…')
  await Promise.all(workers.map((w) => w.close()))
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
