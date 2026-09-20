/**
 * Who the crawler may talk to. Two independent gates, both required:
 *
 *  1. the environment — SCRAPE_ENABLED, plus the domain in SCRAPE_ALLOWED_DOMAINS;
 *  2. the database — the domain enabled in /admin/sources, with its terms of
 *     service marked as reviewed.
 *
 * Gate 1 is checked first and is pure, so a blocked URL is refused before any
 * database query or network request. Changing gate 1 needs shell access to
 * the server, which is why a compromised admin session alone cannot aim the
 * crawler anywhere new. SSRF hygiene (public HTTPS hosts only) runs last.
 *
 * Explicitly out of scope, now and later: rotating or disguised User-Agents,
 * proxies, fingerprint spoofing, CAPTCHA solving, and authenticated fetching.
 */
import { and, eq, isNotNull } from 'drizzle-orm'
import { db } from '../db/index'
import { scrapeSources } from '../db/schema/content'
import { env } from '../env/index'
import { FetchPolicyError } from '../http/fetch'
import { assertPublicHttpsUrl } from '../http/ssrf'

export type ScrapeConfig = { enabled: boolean; allowedDomains: string[] }
export type ScrapeSource = typeof scrapeSources.$inferSelect

export function scrapeConfig(): ScrapeConfig {
  return { enabled: env.SCRAPE_ENABLED, allowedDomains: env.SCRAPE_ALLOWED_DOMAINS }
}

/** An honest, identifying User-Agent with a way for site owners to reach us. */
export function scraperUserAgent(): string {
  const contact = env.SCRAPE_CONTACT ? `; +${env.SCRAPE_CONTACT}` : ''
  return `ISSBPrepBot/0.1 (question-bank research crawler${contact})`
}

/** The allow-listed domain covering `host` (itself or a subdomain), or null. */
export function allowedDomainFor(host: string, allowed: string[]): string | null {
  const h = host.toLowerCase().replace(/\.$/, '')
  return allowed.find((d) => h === d || h.endsWith(`.${d}`)) ?? null
}

/** Gate 1: environment. Pure — no DB, no network. Returns the matching domain. */
export function assertEnvAllows(url: URL, cfg: ScrapeConfig = scrapeConfig()): string {
  if (!cfg.enabled) {
    throw new FetchPolicyError('Scraping is switched off (SCRAPE_ENABLED is not true)')
  }
  const domain = allowedDomainFor(url.hostname, cfg.allowedDomains)
  if (!domain) throw new FetchPolicyError(`${url.hostname} is not in SCRAPE_ALLOWED_DOMAINS`)
  return domain
}

/** Gate 2: the admin source list. */
export async function enabledSourceFor(domain: string): Promise<ScrapeSource | null> {
  const [source] = await db
    .select()
    .from(scrapeSources)
    .where(
      and(
        eq(scrapeSources.domain, domain),
        eq(scrapeSources.enabled, true),
        isNotNull(scrapeSources.tosReviewedAt),
      ),
    )
    .limit(1)
  return source ?? null
}

export type GateDeps = {
  cfg?: ScrapeConfig
  resolve?: Parameters<typeof assertPublicHttpsUrl>[1]
}

/** All gates, for the first URL and every redirect hop. */
export async function assertScrapeAllowed(url: URL, deps: GateDeps = {}): Promise<ScrapeSource> {
  const domain = assertEnvAllows(url, deps.cfg)
  const source = await enabledSourceFor(domain)
  if (!source) throw new FetchPolicyError(`${domain} is not enabled in the admin source list`)
  await assertPublicHttpsUrl(url, deps.resolve)
  return source
}
