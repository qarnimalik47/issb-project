/**
 * The scrape pipeline: admin-managed sources, runs, and the two worker steps.
 *
 *   run → source_documents (provenance) → fetch job → raw snapshot in storage
 *       → extract job → staging (needs_rewrite for third-party content)
 *       → human rewrite + review → draft question → explicit publish
 *
 * Fetch and extract are separate jobs so extraction can be re-run after tuning
 * the heuristics without a single extra request to the source site.
 *
 * Nothing here evades anything: an honest User-Agent, robots.txt obeyed and
 * failing closed, per-domain politeness, and any sign of access control
 * (401/402/403/407/451, login or paywall pages) ends the attempt for good.
 */
import { createHash } from 'node:crypto'
import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import {
  importBatches,
  questions,
  scrapeSources,
  sourceDocuments,
  stagingQuestions,
  testTypes,
} from '../db/schema/content'
import { env } from '../env/index'
import { ApiError } from '../api/errors'
import { storage } from '../storage/index'
import { enqueue, QUEUE_NAMES } from '../queue/index'
import { questionContentHash } from '../import/parse'
import { FetchPolicyError, FetchTooLargeError, safeFetch } from '../http/fetch'
import {
  allowedDomainFor,
  assertEnvAllows,
  assertScrapeAllowed,
  scraperUserAgent,
  type GateDeps,
} from './policy'
import { checkRobots } from './robots'
import { acquireDomainSlot } from './politeness'
import { extractFromHtml } from './extract'

type Licence = typeof scrapeSources.$inferSelect.licence

const ACCESS_CONTROLLED = new Set([401, 402, 403, 407, 451])
const MAX_PAGE_BYTES = 3 * 1024 * 1024

// --- Sources ------------------------------------------------------------------

/** "https://www.Example.org/path" → "example.org". */
export function normaliseDomain(input: string): string {
  const raw = input.trim().toLowerCase()
  const host = raw.includes('://') ? new URL(raw).hostname : raw.split('/')[0]!.split(':')[0]!
  return host.replace(/^www\./, '').replace(/\.$/, '')
}

export async function listSources() {
  const rows = await db.select().from(scrapeSources).orderBy(scrapeSources.domain)
  // How much of the live bank each source already accounts for — the check
  // against compiling too much of any single site.
  const usage = await db
    .select({ sourceId: sourceDocuments.scrapeSourceId, n: count() })
    .from(questions)
    .innerJoin(sourceDocuments, eq(questions.sourceDocumentId, sourceDocuments.id))
    .groupBy(sourceDocuments.scrapeSourceId)
  const liveBy = new Map(usage.map((u) => [u.sourceId, u.n]))
  return rows.map((r) => ({ ...r, questionsFromSource: liveBy.get(r.id) ?? 0 }))
}

export async function createSource(
  input: {
    domain: string
    licence: Licence
    attribution?: string | null
    notes?: string | null
    maxPages?: number
  },
  userId: string,
) {
  const domain = normaliseDomain(input.domain)
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
    throw new ApiError('validation_failed', 'Enter a domain name such as example.org')
  }
  const [row] = await db
    .insert(scrapeSources)
    .values({
      domain,
      licence: input.licence,
      attribution: input.attribution || null,
      notes: input.notes || null,
      maxPages: input.maxPages ?? 25,
      createdBy: userId,
    })
    .onConflictDoNothing()
    .returning()
  if (!row) throw new ApiError('conflict', `${domain} is already in the source list`)
  return row
}

/**
 * Enabling a source requires its terms of service to have been reviewed by a
 * person: robots.txt compliance is not terms-of-service compliance, and many
 * sites forbid automated access outright.
 */
export async function updateSource(
  id: string,
  patch: {
    enabled?: boolean
    tosReviewed?: boolean
    licence?: Licence
    attribution?: string | null
    notes?: string | null
    maxPages?: number
  },
) {
  const [existing] = await db.select().from(scrapeSources).where(eq(scrapeSources.id, id)).limit(1)
  if (!existing) throw new ApiError('not_found', 'Source not found')
  const tosReviewedAt =
    patch.tosReviewed === undefined
      ? existing.tosReviewedAt
      : patch.tosReviewed
        ? (existing.tosReviewedAt ?? new Date())
        : null
  const enabled = patch.enabled ?? existing.enabled
  if (enabled && !tosReviewedAt) {
    throw new ApiError(
      'validation_failed',
      "Confirm you have read this site's terms of service before enabling it",
    )
  }
  const [row] = await db
    .update(scrapeSources)
    .set({
      enabled,
      tosReviewedAt,
      ...(patch.licence ? { licence: patch.licence } : {}),
      ...(patch.attribution !== undefined ? { attribution: patch.attribution || null } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes || null } : {}),
      ...(patch.maxPages ? { maxPages: patch.maxPages } : {}),
      updatedAt: new Date(),
    })
    .where(eq(scrapeSources.id, id))
    .returning()
  return row!
}

// --- Runs -----------------------------------------------------------------------

export async function createScrapeRun(
  input: { sourceId: string; urls: string[]; testTypeId?: string | null; userId: string },
  deps: { cfg?: GateDeps['cfg']; enqueueFetch?: (docId: string) => Promise<void> } = {},
) {
  const [source] = await db
    .select()
    .from(scrapeSources)
    .where(eq(scrapeSources.id, input.sourceId))
    .limit(1)
  if (!source) throw new ApiError('not_found', 'Source not found')
  if (!source.enabled || !source.tosReviewedAt) {
    throw new ApiError('validation_failed', `${source.domain} is not enabled`)
  }
  if (input.testTypeId) {
    const [tt] = await db
      .select({ scoringType: testTypes.scoringType })
      .from(testTypes)
      .where(eq(testTypes.id, input.testTypeId))
      .limit(1)
    if (tt?.scoringType !== 'objective') {
      throw new ApiError('validation_failed', 'Pick an objective (MCQ) test type')
    }
  }

  const problems: string[] = []
  const urls: URL[] = []
  for (const raw of [...new Set(input.urls.map((u) => u.trim()).filter(Boolean))]) {
    let url: URL
    try {
      url = new URL(raw)
    } catch {
      problems.push(`Not a URL: ${raw}`)
      continue
    }
    if (url.protocol !== 'https:') problems.push(`Only https:// URLs: ${raw}`)
    else if (allowedDomainFor(url.hostname, [source.domain]) !== source.domain) {
      problems.push(`Not on ${source.domain}: ${raw}`)
    } else urls.push(url)
  }
  if (problems.length) {
    throw new ApiError('validation_failed', problems[0]!, {
      details: problems.map((message) => ({ path: 'urls', message })),
    })
  }
  if (urls.length === 0) throw new ApiError('validation_failed', 'Add at least one URL')
  if (urls.length > source.maxPages) {
    throw new ApiError(
      'validation_failed',
      `${source.domain} is capped at ${source.maxPages} pages per run`,
    )
  }
  // Gate 1 up front, so a switched-off scraper refuses the run outright.
  try {
    assertEnvAllows(urls[0]!, deps.cfg)
  } catch (err) {
    throw new ApiError('validation_failed', err instanceof Error ? err.message : 'Not allowed')
  }

  const [batch] = await db
    .insert(importBatches)
    .values({
      source: 'scrape',
      filename: `${source.domain} — ${urls.length} page${urls.length === 1 ? '' : 's'}`,
      status: 'fetching',
      testTypeId: input.testTypeId ?? null,
      createdBy: input.userId,
      meta: { sourceId: source.id, documents: urls.length },
    })
    .returning({ id: importBatches.id })
  const docs = await db
    .insert(sourceDocuments)
    .values(
      urls.map((u) => ({
        batchId: batch!.id,
        scrapeSourceId: source.id,
        url: u.toString(),
        acquisition: 'scrape' as const,
        licence: source.licence,
        attribution: source.attribution,
      })),
    )
    .returning({ id: sourceDocuments.id })

  const enqueueFetch =
    deps.enqueueFetch ??
    ((docId: string) =>
      enqueue(QUEUE_NAMES.scrapeFetch, 'fetch', { documentId: docId }, { jobId: `sf_${docId}` }))
  for (const d of docs) await enqueueFetch(d.id)
  return { batchId: batch!.id, documents: docs.length }
}

/** Recompute a batch's status and counters from its documents. */
async function refreshBatch(batchId: string) {
  const rows = await db
    .select({ status: sourceDocuments.status, n: count() })
    .from(sourceDocuments)
    .where(eq(sourceDocuments.batchId, batchId))
    .groupBy(sourceDocuments.status)
  const by = Object.fromEntries(rows.map((r) => [r.status, r.n])) as Record<string, number>
  const [staged] = await db
    .select({ n: count() })
    .from(stagingQuestions)
    .where(eq(stagingQuestions.batchId, batchId))
  const inFlight = (by.queued ?? 0) + (by.fetched ?? 0)
  const [batch] = await db
    .select({ meta: importBatches.meta })
    .from(importBatches)
    .where(eq(importBatches.id, batchId))
  await db
    .update(importBatches)
    .set({
      status: inFlight > 0 ? 'fetching' : 'ready',
      meta: {
        ...((batch?.meta as Record<string, unknown>) ?? {}),
        extracted: by.extracted ?? 0,
        skipped: by.skipped ?? 0,
        failed: by.failed ?? 0,
        inserted: staged?.n ?? 0,
      },
    })
    .where(eq(importBatches.id, batchId))
}

// --- Worker step 1: fetch ---------------------------------------------------------

export type FetchOutcome =
  | { kind: 'done'; status: string }
  /** Come back later without spending a retry (politeness gate, 429). */
  | { kind: 'delay'; ms: number }
  /** Transient failure (5xx, timeout): let the queue's backoff retry it. */
  | { kind: 'retry'; reason: string }

export type FetchDeps = GateDeps & {
  fetchImpl?: typeof fetch
  gapMs?: number
  enqueueExtract?: (docId: string) => Promise<void>
}

function retryAfterMs(header: string | null): number | null {
  if (!header) return null
  const seconds = Number(header)
  if (Number.isFinite(seconds)) return Math.min(Math.max(seconds, 1), 3600) * 1000
  const date = Date.parse(header)
  return Number.isFinite(date) ? Math.min(Math.max(date - Date.now(), 1000), 3600_000) : null
}

export async function fetchSourceDocument(
  documentId: string,
  deps: FetchDeps = {},
): Promise<FetchOutcome> {
  const [doc] = await db
    .select()
    .from(sourceDocuments)
    .where(eq(sourceDocuments.id, documentId))
    .limit(1)
  if (!doc?.url || doc.status !== 'queued')
    return { kind: 'done', status: doc?.status ?? 'missing' }

  const finish = async (status: 'skipped' | 'failed', reason: string) => {
    await db
      .update(sourceDocuments)
      .set({ status, reason })
      .where(eq(sourceDocuments.id, documentId))
    await refreshBatch(doc.batchId)
    return { kind: 'done' as const, status }
  }

  const url = new URL(doc.url)
  const gate = (u: URL) => assertScrapeAllowed(u, deps).then(() => undefined)
  let source
  try {
    source = await assertScrapeAllowed(url, deps)
  } catch (err) {
    if (err instanceof FetchPolicyError) return finish('skipped', err.message)
    throw err
  }

  const userAgent = scraperUserAgent()
  const robots = await checkRobots(url, userAgent, async (robotsUrl) => {
    const r = await safeFetch(robotsUrl.toString(), {
      headers: { 'user-agent': userAgent },
      maxBytes: 512 * 1024,
      timeoutMs: 10_000,
      checkUrl: gate,
      fetchImpl: deps.fetchImpl,
    })
    return { status: r.status, body: r.body.toString('utf8') }
  })
  await db
    .update(sourceDocuments)
    .set({ robotsAllowed: robots.allowed, robotsCheckedAt: new Date() })
    .where(eq(sourceDocuments.id, documentId))
  if (!robots.allowed) return finish('skipped', robots.reason)

  const gap = deps.gapMs ?? Math.max(env.SCRAPE_DOMAIN_DELAY_MS, robots.crawlDelayMs ?? 0)
  const wait = await acquireDomainSlot(source.domain, gap)
  if (wait > 0) return { kind: 'delay', ms: wait }

  let res
  try {
    res = await safeFetch(url.toString(), {
      headers: { 'user-agent': userAgent, accept: 'text/html,application/xhtml+xml' },
      maxBytes: MAX_PAGE_BYTES,
      timeoutMs: 20_000,
      checkUrl: gate,
      fetchImpl: deps.fetchImpl,
    })
  } catch (err) {
    if (err instanceof FetchPolicyError) return finish('skipped', err.message)
    if (err instanceof FetchTooLargeError) return finish('skipped', 'Page is larger than 3 MB')
    const reason = err instanceof Error ? err.message : 'Network error'
    await db.update(sourceDocuments).set({ reason }).where(eq(sourceDocuments.id, documentId))
    return { kind: 'retry', reason }
  }

  await db
    .update(sourceDocuments)
    .set({ httpStatus: res.status })
    .where(eq(sourceDocuments.id, documentId))
  if (ACCESS_CONTROLLED.has(res.status)) {
    // The site refused us. Retrying would be both rude and exactly what
    // evasion looks like, so this ends here.
    return finish('skipped', `Access controlled (HTTP ${res.status}) — not retried`)
  }
  if (res.status === 429)
    return { kind: 'delay', ms: retryAfterMs(res.headers.get('retry-after')) ?? 60_000 }
  if (res.status === 404 || res.status === 410)
    return finish('skipped', `Not found (HTTP ${res.status})`)
  if (res.status >= 500) return { kind: 'retry', reason: `HTTP ${res.status}` }
  if (res.status < 200 || res.status >= 300)
    return finish('skipped', `Unexpected HTTP ${res.status}`)

  const contentType = res.headers.get('content-type') ?? ''
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    return finish('skipped', `Not an HTML page (${contentType || 'no content type'})`)
  }

  const storageKey = `scrape/${doc.id}.html`
  await storage.put(storageKey, res.body, { mime: 'text/html' })
  await db
    .update(sourceDocuments)
    .set({
      status: 'fetched',
      storageKey,
      contentType,
      sha256: createHash('sha256').update(res.body).digest('hex'),
      fetchedAt: new Date(),
      reason: null,
    })
    .where(eq(sourceDocuments.id, documentId))

  const enqueueExtract =
    deps.enqueueExtract ??
    ((id: string) =>
      enqueue(
        QUEUE_NAMES.scrapeExtract,
        'extract',
        { documentId: id },
        { jobId: `se_${id}_${Date.now()}` },
      ))
  await enqueueExtract(doc.id)
  return { kind: 'done', status: 'fetched' }
}

/** Called by the worker after the final retry: record the failure for the admin. */
export async function markDocumentFailed(documentId: string, reason: string) {
  const [doc] = await db
    .update(sourceDocuments)
    .set({ status: 'failed', reason })
    .where(eq(sourceDocuments.id, documentId))
    .returning({ batchId: sourceDocuments.batchId })
  if (doc) await refreshBatch(doc.batchId)
}

// --- Worker step 2: extract ------------------------------------------------------

/**
 * Stage the questions found in a stored snapshot. Idempotent: re-running it
 * (after tuning the extractor) re-stages nothing already pending or live, and
 * makes no network request.
 */
export async function extractSourceDocument(documentId: string) {
  const [doc] = await db
    .select()
    .from(sourceDocuments)
    .where(eq(sourceDocuments.id, documentId))
    .limit(1)
  if (!doc?.storageKey) return { staged: 0, duplicates: 0 }

  const html = (await storage.get(doc.storageKey)).toString('utf8')
  const { items, interstitial } = extractFromHtml(html)
  if (interstitial) {
    await db
      .update(sourceDocuments)
      .set({
        status: 'skipped',
        reason: `Login or paywall page ("${interstitial}") — nothing staged`,
        extractedCount: 0,
      })
      .where(eq(sourceDocuments.id, documentId))
    await refreshBatch(doc.batchId)
    return { staged: 0, duplicates: 0 }
  }

  const withHash = items.map((it) => ({ ...it, hash: questionContentHash(it.stemEn, it.options) }))
  const hashes = [...new Set(withHash.map((i) => i.hash))]
  const [live, pending] = hashes.length
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
  const known = new Set([...live, ...pending].map((r) => r.h))

  // Third-party text may not go live as extracted; everything else is clear.
  const reviewState = doc.licence === 'third_party_unlicensed' ? 'needs_rewrite' : 'clear'
  let staged = 0
  let duplicates = 0
  for (const it of withHash) {
    if (known.has(it.hash)) {
      duplicates++
      continue
    }
    known.add(it.hash)
    const [row] = await db
      .insert(stagingQuestions)
      .values({
        batchId: doc.batchId,
        extracted: {
          stemEn: it.stemEn,
          options: it.options,
          correctOption: it.correctOption,
          explanation: it.explanation,
          hasFigure: it.hasFigure,
        },
        contentHash: it.hash,
        confidence: String(it.confidence),
        status: 'pending',
        reviewState,
        sourceDocumentId: doc.id,
      })
      .onConflictDoNothing()
      .returning({ id: stagingQuestions.id })
    if (row) staged++
    else duplicates++
  }

  await db
    .update(sourceDocuments)
    .set({ status: 'extracted', extractedCount: (doc.extractedCount ?? 0) + staged })
    .where(eq(sourceDocuments.id, documentId))
  await refreshBatch(doc.batchId)
  return { staged, duplicates }
}

/** Re-run extraction on a stored snapshot — zero requests to the source. */
export async function reextractDocument(documentId: string) {
  const [doc] = await db
    .select()
    .from(sourceDocuments)
    .where(eq(sourceDocuments.id, documentId))
    .limit(1)
  if (!doc) throw new ApiError('not_found', 'Document not found')
  if (!doc.storageKey) throw new ApiError('validation_failed', 'This document was never fetched')
  return extractSourceDocument(documentId)
}
