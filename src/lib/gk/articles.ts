/**
 * Current-affairs ingestion & editorial workflow (build prompt §4.5).
 *
 * Ingestion is a fault-tolerant background job: it fetches RSS feeds, drafts an
 * ORIGINAL short summary (never the source text) with an "ISSB angle", and
 * stores the item as a DRAFT. Nothing is published until a human editor
 * approves it. Every item keeps its source name, link and date.
 */
import { and, desc, eq, ilike, or } from 'drizzle-orm'
import { db } from '../db/index'
import { gkArticles, gkBookmarks } from '../db/schema/gk'
import { childLogger } from '../logger/index'

const log = childLogger('gk-ingest')

export type FeedConfig = { url: string; category: string; sourceName: string }

type RssItem = { title: string; link: string; pubDate?: string }

/** Minimal, dependency-free RSS/Atom item extraction. */
export function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = []
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) ?? []
  for (const block of blocks) {
    const title = clean(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1])
    let link = clean(block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1])
    if (!link) link = block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? ''
    const pubDate = clean(
      block.match(
        /<(pubDate|updated|published)[^>]*>([\s\S]*?)<\/(pubDate|updated|published)>/i,
      )?.[2],
    )
    if (title) items.push({ title, link, pubDate })
  }
  return items
}

function clean(s: string | undefined): string {
  if (!s) return ''
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim()
}

/**
 * Draft an ORIGINAL summary from an item's title only (we never copy source
 * body text). Placeholder drafting; a real AI provider can replace this behind
 * the same function. The editor MUST refine before publishing.
 */
function draftSummary(
  title: string,
  category: string,
): { summaryEn: string; issbAngle: string; oneLiner: string } {
  return {
    summaryEn: `${title}. (Draft — editor to write an original 2–3 line summary before publishing.)`,
    issbAngle: `Be ready to discuss the significance of this ${category} development and its implications for Pakistan.`,
    oneLiner: `${title} — know the key facts and your balanced view.`,
  }
}

export async function ingestFeeds(
  feeds: FeedConfig[],
): Promise<{ drafted: number; skipped: number; failed: number }> {
  let drafted = 0
  let skipped = 0
  let failed = 0

  for (const feed of feeds) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(feed.url, { signal: controller.signal }).finally(() =>
        clearTimeout(timer),
      )
      if (!res.ok) {
        failed++
        continue
      }
      const xml = await res.text()
      const items = parseRss(xml).slice(0, 15)
      for (const item of items) {
        if (!item.link) continue
        const [existing] = await db
          .select({ id: gkArticles.id })
          .from(gkArticles)
          .where(eq(gkArticles.sourceUrl, item.link))
          .limit(1)
        if (existing) {
          skipped++
          continue
        }
        const d = draftSummary(item.title, feed.category)
        await db.insert(gkArticles).values({
          headline: item.title,
          summaryEn: d.summaryEn,
          issbAngle: d.issbAngle,
          oneLiner: d.oneLiner,
          category: feed.category,
          sourceName: feed.sourceName,
          sourceUrl: item.link,
          publishedDate: item.pubDate ? safeDate(item.pubDate) : null,
          status: 'draft',
        })
        drafted++
      }
    } catch (err) {
      log.error({ err, feed: feed.url }, 'feed ingestion failed (continuing)')
      failed++
    }
  }
  log.info({ drafted, skipped, failed }, 'ingestion complete')
  return { drafted, skipped, failed }
}

function safeDate(s: string): string | null {
  const t = Date.parse(s)
  return Number.isNaN(t) ? null : new Date(t).toISOString().slice(0, 10)
}

// --- Editorial ---
export async function listDrafts() {
  return db
    .select()
    .from(gkArticles)
    .where(eq(gkArticles.status, 'draft'))
    .orderBy(desc(gkArticles.createdAt))
    .limit(100)
}

export async function approveArticle(
  id: string,
  adminId: string,
  edits?: Partial<{
    summaryEn: string
    summaryUr: string
    issbAngle: string
    oneLiner: string
    category: string
  }>,
): Promise<void> {
  await db
    .update(gkArticles)
    .set({ ...edits, status: 'published', approvedBy: adminId })
    .where(eq(gkArticles.id, id))
}

export async function rejectArticle(id: string): Promise<void> {
  await db.update(gkArticles).set({ status: 'archived' }).where(eq(gkArticles.id, id))
}

// --- Digest (published) ---
export async function listPublished(opts: { category?: string; q?: string; limit?: number } = {}) {
  const conds = [eq(gkArticles.status, 'published')]
  if (opts.category) conds.push(eq(gkArticles.category, opts.category))
  if (opts.q) {
    const like = `%${opts.q}%`
    conds.push(or(ilike(gkArticles.headline, like), ilike(gkArticles.summaryEn, like))!)
  }
  return db
    .select()
    .from(gkArticles)
    .where(and(...conds))
    .orderBy(desc(gkArticles.publishedDate), desc(gkArticles.createdAt))
    .limit(opts.limit ?? 50)
}

export async function toggleBookmark(userId: string, articleId: string): Promise<boolean> {
  const [existing] = await db
    .select({ id: gkBookmarks.id })
    .from(gkBookmarks)
    .where(and(eq(gkBookmarks.userId, userId), eq(gkBookmarks.articleId, articleId)))
    .limit(1)
  if (existing) {
    await db.delete(gkBookmarks).where(eq(gkBookmarks.id, existing.id))
    return false
  }
  await db.insert(gkBookmarks).values({ userId, articleId })
  return true
}
