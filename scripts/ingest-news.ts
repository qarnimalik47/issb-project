/**
 * Current-affairs ingestion job (build prompt §4.5). Scheduled via OS cron or
 * the /schedule routine. Fault-tolerant: a down feed never aborts the run.
 *
 *   npm run ingest:news              # store as drafts for editorial review
 *   npm run ingest:news -- --publish # publish headlines straight to the digest
 *
 * Feeds come from GK_FEEDS (a JSON array of {url, category, sourceName}) when
 * it is set, and from the bundled DEFAULT_FEEDS otherwise. Only the headline,
 * the link and the date are stored — never the body of an article.
 */
import 'dotenv/config'
import { ingestFeeds, DEFAULT_FEEDS, type FeedConfig } from '../src/lib/gk/articles'
import { refreshAllCoverage } from '../src/lib/gk/topics'
import { sql as rawSql } from '../src/lib/db/index'

function loadFeeds(): FeedConfig[] {
  const raw = process.env.GK_FEEDS
  if (!raw) return DEFAULT_FEEDS
  try {
    return JSON.parse(raw) as FeedConfig[]
  } catch {
    console.error('GK_FEEDS is not valid JSON — falling back to the bundled feeds')
    return DEFAULT_FEEDS
  }
}

const publish = process.argv.includes('--publish')

try {
  const feeds = loadFeeds()
  console.warn(`Reading ${feeds.length} feed(s): ${feeds.map((f) => f.sourceName).join(', ')}`)
  const result = await ingestFeeds(feeds, { publish, perFeed: 25 })
  console.warn(
    `Ingestion: ${publish ? 'published' : 'drafted'}=${result.drafted} ` +
      `skipped=${result.skipped} failed=${result.failed}`,
  )

  if (publish) {
    const cov = await refreshAllCoverage()
    console.warn(`Coverage: ${cov.withCoverage} of ${cov.updated} topic(s) now carry headlines.`)
  }
} finally {
  await rawSql.end()
}
