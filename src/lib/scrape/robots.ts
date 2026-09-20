/**
 * robots.txt, evaluated against our declared User-Agent and cached per origin
 * for 24 hours. Allow/Disallow longest-match precedence is subtle, hence the
 * robots-parser dependency rather than a regex.
 *
 * It fails CLOSED: if robots.txt can't be fetched (5xx, timeout, network), is
 * access-controlled (401/403 and the like) or can't be read, the answer is
 * "don't crawl". Only a clean 404/410 — the site has no robots.txt — means
 * everything is allowed. robots.txt is a technical floor, not legal clearance:
 * a site's terms can forbid automated access regardless.
 */
import robotsParser from 'robots-parser'
import { ensureRedis, redis } from '../redis/index'

export type RobotsEntry =
  | { kind: 'rules'; body: string }
  | { kind: 'allow_all'; reason: string }
  | { kind: 'deny_all'; reason: string }

export type RobotsDecision = { allowed: boolean; reason: string; crawlDelayMs: number | null }

const CACHE_TTL_SECONDS = 24 * 3600
/** Failures are cached briefly, so an outage doesn't mean a retry storm. */
const FAILURE_TTL_SECONDS = 3600

/** Map a robots.txt fetch outcome to what it means for crawling. Pure. */
export function entryFromFetch(outcome: { status: number; body: string } | 'error'): RobotsEntry {
  if (outcome === 'error')
    return { kind: 'deny_all', reason: 'robots.txt unreachable — failing closed' }
  const { status, body } = outcome
  if (status === 404 || status === 410) return { kind: 'allow_all', reason: 'No robots.txt' }
  if (status >= 200 && status < 300) return { kind: 'rules', body }
  if (status >= 500)
    return { kind: 'deny_all', reason: `robots.txt returned HTTP ${status} — failing closed` }
  return { kind: 'deny_all', reason: `robots.txt returned HTTP ${status}` }
}

/** Evaluate one URL against a cached entry. Pure. */
export function evaluateRobots(entry: RobotsEntry, url: URL, userAgent: string): RobotsDecision {
  if (entry.kind === 'allow_all') return { allowed: true, reason: entry.reason, crawlDelayMs: null }
  if (entry.kind === 'deny_all') return { allowed: false, reason: entry.reason, crawlDelayMs: null }
  const robots = robotsParser(new URL('/robots.txt', url).toString(), entry.body)
  const allowed = robots.isAllowed(url.toString(), userAgent)
  const delay = robots.getCrawlDelay(userAgent)
  return {
    // undefined means the parser could not place the URL; treat as a refusal.
    allowed: allowed === true,
    reason: allowed ? 'Allowed by robots.txt' : 'Disallowed by robots.txt',
    crawlDelayMs: typeof delay === 'number' && delay > 0 ? Math.min(delay, 600) * 1000 : null,
  }
}

export type RobotsFetcher = (robotsUrl: URL) => Promise<{ status: number; body: string }>

export async function checkRobots(
  url: URL,
  userAgent: string,
  fetchRobots: RobotsFetcher,
): Promise<RobotsDecision> {
  const key = `scrape:robots:${url.origin}`
  await ensureRedis()
  const cached = await redis.get(key)
  let entry: RobotsEntry
  if (cached) {
    entry = JSON.parse(cached) as RobotsEntry
  } else {
    try {
      entry = entryFromFetch(await fetchRobots(new URL('/robots.txt', url)))
    } catch {
      entry = entryFromFetch('error')
    }
    const ttl = entry.kind === 'deny_all' ? FAILURE_TTL_SECONDS : CACHE_TTL_SECONDS
    await redis.set(key, JSON.stringify(entry), 'EX', ttl)
  }
  return evaluateRobots(entry, url, userAgent)
}
