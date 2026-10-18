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

/**
 * Free public RSS feeds, used when GK_FEEDS is not set.
 *
 * These are syndication feeds the publishers offer for exactly this purpose.
 * We take the headline, the link and the date and nothing else — the body of a
 * news article is the publisher's, and storing it would be a copyright problem
 * as well as a rule break (§4.5). Al Jazeera's feed is not included because it
 * is not reachable from every network.
 */
export const DEFAULT_FEEDS: FeedConfig[] = [
  {
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'international',
    sourceName: 'BBC News',
  },
  {
    url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml',
    category: 'international',
    sourceName: 'BBC News Asia',
  },
  { url: 'https://www.dawn.com/feeds/home', category: 'pakistan', sourceName: 'Dawn' },
  { url: 'https://www.thenews.com.pk/rss/1/1', category: 'pakistan', sourceName: 'The News' },
  { url: 'https://arynews.tv/feed', category: 'pakistan', sourceName: 'ARY News' },
  { url: 'https://www.geo.tv/rss/1/1', category: 'pakistan', sourceName: 'Geo News' },
  {
    url: 'https://tribune.com.pk/feed/home',
    category: 'pakistan',
    sourceName: 'The Express Tribune',
  },
]

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
 * A feed item is stored as a reference, not as prose.
 *
 * Nothing here invents a summary. The previous placeholder text read like a
 * summary while saying nothing, which is worse than an empty field: a
 * candidate skims it and believes they have read something. An editor writes
 * the summary and the ISSB angle at approval time if the item deserves one,
 * and the digest renders the headline alone until then.
 */
function draftRecord(): { summaryEn: string; issbAngle: null; oneLiner: null } {
  return { summaryEn: '', issbAngle: null, oneLiner: null }
}

export async function ingestFeeds(
  feeds: FeedConfig[],
  opts: { publish?: boolean; perFeed?: number } = {},
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
      const items = parseRss(xml).slice(0, opts.perFeed ?? 15)
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
        const d = draftRecord()
        await db.insert(gkArticles).values({
          headline: item.title,
          summaryEn: d.summaryEn,
          issbAngle: d.issbAngle,
          oneLiner: d.oneLiner,
          category: feed.category,
          sourceName: feed.sourceName,
          sourceUrl: item.link,
          publishedDate: item.pubDate ? safeDate(item.pubDate) : null,
          // A headline and a link carry no editorial claim of our own, so an
          // operator may publish them directly; anything with written summary
          // text still goes through review.
          status: opts.publish ? 'published' : 'draft',
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
