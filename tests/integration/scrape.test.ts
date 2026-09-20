import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import {
  importBatches,
  questions,
  scrapeSources,
  sourceDocuments,
  stagingQuestions,
  testTypes,
} from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { eq, inArray } from 'drizzle-orm'
import {
  createScrapeRun,
  extractSourceDocument,
  fetchSourceDocument,
  updateSource,
} from '../../src/lib/scrape/service'
import { approveStagingItem, saveStagingEdit } from '../../src/lib/import/service'
import { questionContentHash } from '../../src/lib/import/parse'
import { ApiError } from '../../src/lib/api/errors'
import { storage } from '../../src/lib/storage/index'
import { redis, ensureRedis } from '../../src/lib/redis/index'

const DOMAIN = 'issb-scrape-test.example'
const ts = Date.now()
const cfg = { enabled: true, allowedDomains: [DOMAIN] }
const resolve = async () => [{ address: '93.184.216.34' }]

let adminId: string
let sourceId: string
let batchId: string
let testTypeId: string
const docIds: string[] = []

const PAGE = `<html><body>
  <p>1. Which organ pumps blood around the human body?</p>
  <ol><li>Liver</li><li>Heart</li><li>Lungs</li><li>Kidney</li></ol>
  <p>Answer: B</p><p>Explanation: The heart is a muscular pump that circulates blood.</p>
  <p>2. How many sides does a hexagon have?</p>
  <ol><li>Five</li><li>Six</li><li>Seven</li><li>Eight</li></ol>
  <p>Answer: B</p>
</body></html>`

type Route = { status: number; body?: string; headers?: Record<string, string> }
function fakeFetch(routes: Record<string, Route>) {
  return vi.fn(async (input: URL | RequestInfo) => {
    const url = new URL(String(input))
    const r = routes[url.pathname] ?? { status: 404 }
    return new Response(r.body ?? '', { status: r.status, headers: r.headers })
  })
}

async function doc(host: string, path = '/mcq') {
  const [d] = await db
    .insert(sourceDocuments)
    .values({
      batchId,
      scrapeSourceId: sourceId,
      url: `https://${host}${path}`,
      acquisition: 'scrape',
      licence: 'third_party_unlicensed',
    })
    .returning({ id: sourceDocuments.id })
  docIds.push(d!.id)
  return d!.id
}

const deps = (fetchImpl: ReturnType<typeof fakeFetch>, extra: object = {}) => ({
  cfg,
  resolve,
  fetchImpl: fetchImpl as unknown as typeof fetch,
  gapMs: 1,
  enqueueExtract: async () => {},
  ...extra,
})

describe('scrape pipeline and rewrite gate (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Scrape Admin', email: `scrape_${ts}@test.com`, role: 'admin' })
      .returning({ id: users.id })
    adminId = u!.id
    await db.delete(scrapeSources).where(eq(scrapeSources.domain, DOMAIN))
    const [s] = await db
      .insert(scrapeSources)
      .values({ domain: DOMAIN, createdBy: adminId })
      .returning({ id: scrapeSources.id })
    sourceId = s!.id
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_scrape_${ts}`,
        nameEn: 'Scrape IT',
        nameUr: 'ٹیسٹ',
        dimension: 'cross_cutting',
        scoringType: 'objective',
        timing: {},
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id
    const [b] = await db
      .insert(importBatches)
      .values({
        source: 'scrape',
        filename: 'it',
        status: 'fetching',
        createdBy: adminId,
        testTypeId,
      })
      .returning({ id: importBatches.id })
    batchId = b!.id
    await ensureRedis()
    await redis.del(`scrape:slot:${DOMAIN}`)
  })

  afterAll(async () => {
    const docs = docIds.length
      ? await db.select().from(sourceDocuments).where(inArray(sourceDocuments.id, docIds))
      : []
    for (const d of docs) if (d.storageKey) await storage.delete(d.storageKey)
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(stagingQuestions).where(eq(stagingQuestions.batchId, batchId))
    await db.delete(importBatches).where(eq(importBatches.createdBy, adminId))
    await db.delete(scrapeSources).where(eq(scrapeSources.id, sourceId))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await db.delete(users).where(eq(users.id, adminId))
    await sql.end()
  })

  it('refuses to enable a source until its terms have been reviewed', async () => {
    await expect(updateSource(sourceId, { enabled: true })).rejects.toBeInstanceOf(ApiError)
    const s = await updateSource(sourceId, { enabled: true, tosReviewed: true })
    expect(s.enabled).toBe(true)
    expect(s.tosReviewedAt).toBeInstanceOf(Date)
  })

  it('never contacts a host outside the allow-list', async () => {
    const f = fakeFetch({})
    const id = await doc('elsewhere.example')
    const r = await fetchSourceDocument(id, deps(f))
    expect(r).toEqual({ kind: 'done', status: 'skipped' })
    expect(f).not.toHaveBeenCalled()
  })

  it('does nothing at all while the kill switch is off', async () => {
    const f = fakeFetch({})
    const id = await doc(`off-${ts}.${DOMAIN}`)
    await fetchSourceDocument(id, deps(f, { cfg: { ...cfg, enabled: false } }))
    expect(f).not.toHaveBeenCalled()
  })

  it('fails closed when robots.txt is unavailable', async () => {
    const f = fakeFetch({ '/robots.txt': { status: 503 } })
    const id = await doc(`robots-${ts}.${DOMAIN}`)
    await fetchSourceDocument(id, deps(f))
    const [row] = await db.select().from(sourceDocuments).where(eq(sourceDocuments.id, id))
    expect(row!.status).toBe('skipped')
    expect(row!.robotsAllowed).toBe(false)
    expect(f).toHaveBeenCalledTimes(1) // robots.txt only; the page was never requested
  })

  it('treats an access-controlled page as final — no retry', async () => {
    const f = fakeFetch({ '/robots.txt': { status: 404 }, '/mcq': { status: 403 } })
    const id = await doc(`forbidden-${ts}.${DOMAIN}`)
    const r = await fetchSourceDocument(id, deps(f))
    expect(r.kind).toBe('done')
    const [row] = await db.select().from(sourceDocuments).where(eq(sourceDocuments.id, id))
    expect(row!.reason).toMatch(/Access controlled \(HTTP 403\)/)
    // Running the job again does not touch the site.
    await fetchSourceDocument(id, deps(f))
    expect(f).toHaveBeenCalledTimes(2)
  })

  it('backs off on 429 using Retry-After, without spending an attempt', async () => {
    const f = fakeFetch({
      '/robots.txt': { status: 404 },
      '/mcq': { status: 429, headers: { 'retry-after': '120' } },
    })
    const id = await doc(`busy-${ts}.${DOMAIN}`)
    expect(await fetchSourceDocument(id, deps(f))).toEqual({ kind: 'delay', ms: 120_000 })
  })

  it('stages extracted questions for mandatory rewrite, with provenance, idempotently', async () => {
    const extracts: string[] = []
    const f = fakeFetch({
      '/robots.txt': { status: 200, body: 'User-agent: *\nDisallow: /private/' },
      '/mcq': { status: 200, body: PAGE, headers: { 'content-type': 'text/html; charset=utf-8' } },
    })
    const id = await doc(`ok-${ts}.${DOMAIN}`)
    const r = await fetchSourceDocument(
      id,
      deps(f, { enqueueExtract: async (d: string) => void extracts.push(d) }),
    )
    expect(r).toEqual({ kind: 'done', status: 'fetched' })
    expect(extracts).toEqual([id])
    const [fetched] = await db.select().from(sourceDocuments).where(eq(sourceDocuments.id, id))
    expect(fetched!.sha256).toMatch(/^[0-9a-f]{64}$/)
    expect(await storage.exists(fetched!.storageKey!)).toBe(true)

    expect(await extractSourceDocument(id)).toEqual({ staged: 2, duplicates: 0 })
    // Re-extraction after tuning the extractor: zero requests, zero new rows.
    expect(await extractSourceDocument(id)).toEqual({ staged: 0, duplicates: 2 })
    expect(f).toHaveBeenCalledTimes(2)

    const staged = await db
      .select()
      .from(stagingQuestions)
      .where(eq(stagingQuestions.sourceDocumentId, id))
    expect(staged).toHaveLength(2)
    expect(staged.every((s) => s.reviewState === 'needs_rewrite')).toBe(true)
  })

  it('blocks approval until the prose is genuinely rewritten, then hashes the rewrite', async () => {
    const [item] = await db
      .select()
      .from(stagingQuestions)
      .where(eq(stagingQuestions.batchId, batchId))
      .orderBy(stagingQuestions.createdAt)
      .limit(1)
    const source = item!.extracted as {
      stemEn: string
      options: { key: string; textEn: string }[]
      explanation: string | null
    }

    // Straight approval is refused by the server, not just the UI.
    await expect(approveStagingItem(item!.id, adminId)).rejects.toMatchObject({ code: 'conflict' })

    // A one-word tweak is still the source's prose.
    const tweak = await saveStagingEdit(item!.id, {
      stemEn: source.stemEn.replace('Which organ', 'Which one organ'),
      options: source.options,
      correctOption: 'B',
      explanation: source.explanation,
    })
    expect(tweak.reviewState).toBe('needs_rewrite')
    await expect(approveStagingItem(item!.id, adminId)).rejects.toMatchObject({ code: 'conflict' })

    const rewrite = {
      stemEn: 'Blood is kept moving through your body mainly by which organ?',
      options: source.options,
      correctOption: 'B',
      explanation: 'Its muscular walls contract rhythmically, pushing blood through the vessels.',
    }
    const ok = await saveStagingEdit(item!.id, rewrite)
    expect(ok.reviewState).toBe('rewritten')

    const r = await approveStagingItem(item!.id, adminId)
    const [live] = await db.select().from(questions).where(eq(questions.id, r.questionId!))
    expect(live!.stemEn).toBe(rewrite.stemEn)
    expect(live!.sourceDocumentId).toBe(item!.sourceDocumentId)
    // The live hash is the REWRITE's, not the source's.
    expect(live!.contentHash).toBe(questionContentHash(rewrite.stemEn, rewrite.options))
    expect(live!.contentHash).not.toBe(item!.contentHash)
  })

  it('refuses a run while scraping is switched off, and checks every URL', async () => {
    const enqueued: string[] = []
    const run = (urls: string[], c = cfg) =>
      createScrapeRun(
        { sourceId, urls, userId: adminId },
        { cfg: c, enqueueFetch: async (d) => void enqueued.push(d) },
      )
    await expect(run([`https://${DOMAIN}/a`], { ...cfg, enabled: false })).rejects.toBeInstanceOf(
      ApiError,
    )
    await expect(run(['https://other.example/a'])).rejects.toThrow(/Not on/)
    await expect(run([`http://${DOMAIN}/a`])).rejects.toThrow(/Only https/)

    const r = await run([`https://${DOMAIN}/a`, `https://www.${DOMAIN}/b`, `https://${DOMAIN}/a`])
    expect(r.documents).toBe(2) // de-duplicated
    expect(enqueued).toHaveLength(2)
    const docs = await db
      .select()
      .from(sourceDocuments)
      .where(eq(sourceDocuments.batchId, r.batchId))
    docIds.push(...docs.map((d) => d.id))
    expect(docs.every((d) => d.licence === 'third_party_unlicensed')).toBe(true)
  })
})
