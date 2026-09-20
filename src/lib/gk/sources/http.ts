/**
 * Shared fetch helper for the free knowledge sources.
 *
 * Wikimedia's API policy asks every client to identify itself and to stay
 * within a modest request rate; an anonymous flood gets rate-limited or
 * blocked, which would take the gather feature down for everyone. So all
 * source calls go through here: one descriptive User-Agent, a hard timeout so
 * a hanging source cannot stall an admin request, and a small delay between
 * calls to the same host.
 */
import { env } from '../../env/index'
import { childLogger } from '../../logger/index'

const log = childLogger('gk-sources')

/** Wikimedia asks for a contact URL in the agent string. */
const USER_AGENT = `ISSBPrepPlatform/1.0 (${env.APP_BASE_URL}; general-knowledge study notes)`

const DEFAULT_TIMEOUT_MS = 8_000

/** Minimum gap between two calls to the same host, per process. */
const MIN_GAP_MS = 120
const lastCallAt = new Map<string, number>()

async function pace(host: string): Promise<void> {
  const previous = lastCallAt.get(host) ?? 0
  const wait = previous + MIN_GAP_MS - Date.now()
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait))
  lastCallAt.set(host, Date.now())
}

/**
 * GET JSON from a free source. Returns null rather than throwing: a gather
 * that loses one source should still produce a topic from the others.
 */
export async function getJson<T>(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T | null> {
  const host = new URL(url).host
  await pace(host)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT, accept: 'application/json' },
    })
    if (!res.ok) {
      log.warn({ url, status: res.status }, 'source responded with an error status')
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    log.warn({ err, url }, 'source request failed')
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function getText(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<string | null> {
  const host = new URL(url).host
  await pace(host)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'user-agent': USER_AGENT },
    })
    if (!res.ok) return null
    return await res.text()
  } catch (err) {
    log.warn({ err, url }, 'source request failed')
    return null
  } finally {
    clearTimeout(timer)
  }
}
