/**
 * Current-affairs ingestion job (build prompt §4.5). Scheduled via OS cron or
 * the /schedule routine. Fault-tolerant: a down feed never aborts the run.
 *
 *   npm run ingest:news
 *
 * Feeds are configured via GK_FEEDS (JSON array of {url, category, sourceName}).
 * No feeds are bundled — licensed sources are provided by the product owner
 * (backlog Q5). Drafted items require human editorial approval before publish.
 */
import 'dotenv/config'
import { ingestFeeds, type FeedConfig } from '../src/lib/gk/articles'
import { sql as rawSql } from '../src/lib/db/index'

function loadFeeds(): FeedConfig[] {
  const raw = process.env.GK_FEEDS
  if (!raw) return []
  try {
    return JSON.parse(raw) as FeedConfig[]
  } catch {
    console.error('GK_FEEDS is not valid JSON')
    return []
  }
}

try {
  const feeds = loadFeeds()
  if (feeds.length === 0) {
    console.warn(
      'No GK_FEEDS configured. Set GK_FEEDS to a JSON array of {url, category, sourceName}.',
    )
  } else {
    const result = await ingestFeeds(feeds)
    console.warn(
      `Ingestion: drafted=${result.drafted} skipped=${result.skipped} failed=${result.failed}`,
    )
  }
} finally {
  await rawSql.end()
}
