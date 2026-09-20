/**
 * Background job queue (BullMQ + Redis, ADR 0001). Slow work — PDF parsing,
 * OCR, speech-to-text, AI evaluation, news ingestion — runs here, never inside
 * an HTTP request (rule 1.4). Jobs are processed by the worker (scripts/worker.ts).
 *
 * Uses the project's dedicated Redis DB index and an "issb" key prefix so other
 * projects sharing this Redis are unaffected.
 */
import { Queue, Worker, type Processor, type JobsOptions, type WorkerOptions } from 'bullmq'
import IORedis from 'ioredis'
import { env } from '../env/index'

export const QUEUE_NAMES = {
  pdfImport: 'pdf-import',
  ocr: 'ocr',
  stt: 'stt',
  evaluation: 'evaluation',
  news: 'news',
  scrapeFetch: 'scrape-fetch',
  scrapeExtract: 'scrape-extract',
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]

const PREFIX = 'issb'

/** BullMQ connections must not cap retries per request. */
export function createQueueConnection(): IORedis {
  return new IORedis(env.REDIS_URL, {
    db: env.REDIS_DB,
    maxRetriesPerRequest: null,
  })
}

const queues = new Map<QueueName, Queue>()

export function getQueue(name: QueueName): Queue {
  let q = queues.get(name)
  if (!q) {
    q = new Queue(name, { connection: createQueueConnection(), prefix: PREFIX })
    queues.set(name, q)
  }
  return q
}

const DEFAULT_JOB_OPTS: JobsOptions = {
  attempts: 5,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: { age: 3600, count: 1000 },
  removeOnFail: { age: 24 * 3600 },
}

/**
 * Enqueue a job. `jobId` enables idempotency: enqueuing the same id twice does
 * not create a duplicate (rule 1.4 / Phase 5).
 */
export async function enqueue<T>(
  name: QueueName,
  jobName: string,
  data: T,
  opts?: JobsOptions & { jobId?: string },
): Promise<void> {
  await getQueue(name).add(jobName, data, { ...DEFAULT_JOB_OPTS, ...opts })
}

/** Create a worker for a queue (used by scripts/worker.ts). */
export function createWorker<T>(
  name: QueueName,
  processor: Processor<T>,
  opts: Pick<WorkerOptions, 'concurrency' | 'limiter'> = {},
): Worker<T> {
  return new Worker<T>(name, processor, {
    connection: createQueueConnection(),
    prefix: PREFIX,
    concurrency: 4,
    ...opts,
  })
}
