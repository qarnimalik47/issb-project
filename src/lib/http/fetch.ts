/**
 * The one way this codebase makes outbound HTTP requests to third parties
 * (rule 1.4: explicit timeouts on every external call — closes the backlog item).
 *
 * Global `fetch` plus an AbortController; no HTTP client dependency. On top of
 * a plain fetch it adds:
 *  - a hard timeout covering the whole exchange, body included;
 *  - a response size cap, enforced while streaming (not after buffering);
 *  - manual redirects, capped, with every hop passed back through `checkUrl`
 *    — so a permitted URL cannot bounce the request somewhere forbidden.
 */

export class FetchPolicyError extends Error {
  readonly kind = 'policy'
}
export class FetchTimeoutError extends Error {
  readonly kind = 'timeout'
}
export class FetchTooLargeError extends Error {
  readonly kind = 'too_large'
}

export type SafeFetchOptions = {
  timeoutMs?: number
  maxBytes?: number
  maxRedirects?: number
  headers?: Record<string, string>
  /** Vets the first URL and every redirect target; throw to refuse. */
  checkUrl?: (url: URL) => Promise<void> | void
  /** Injectable for tests. */
  fetchImpl?: typeof fetch
}

export type SafeResponse = {
  status: number
  /** The URL that finally answered, after redirects. */
  url: string
  headers: Headers
  body: Buffer
}

const REDIRECTS = new Set([301, 302, 303, 307, 308])

async function readCapped(res: Response, maxBytes: number): Promise<Buffer> {
  const declared = Number(res.headers.get('content-length') ?? 0)
  if (declared > maxBytes) throw new FetchTooLargeError(`Response is ${declared} bytes`)
  if (!res.body) return Buffer.alloc(0)
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      throw new FetchTooLargeError(`Response exceeded ${maxBytes} bytes`)
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function safeFetch(input: string, opts: SafeFetchOptions = {}): Promise<SafeResponse> {
  const timeoutMs = opts.timeoutMs ?? 15_000
  const maxBytes = opts.maxBytes ?? 5 * 1024 * 1024
  const maxRedirects = opts.maxRedirects ?? 3
  const doFetch = opts.fetchImpl ?? fetch

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    let url = new URL(input)
    for (let hop = 0; ; hop++) {
      await opts.checkUrl?.(url)
      let res: Response
      try {
        res = await doFetch(url, {
          headers: opts.headers,
          redirect: 'manual',
          signal: controller.signal,
        })
      } catch (err) {
        if (controller.signal.aborted)
          throw new FetchTimeoutError(`Timed out after ${timeoutMs} ms`)
        throw err
      }

      if (REDIRECTS.has(res.status)) {
        const location = res.headers.get('location')
        await res.body?.cancel()
        if (!location) throw new FetchPolicyError(`HTTP ${res.status} without a Location header`)
        if (hop >= maxRedirects) throw new FetchPolicyError(`More than ${maxRedirects} redirects`)
        url = new URL(location, url)
        continue
      }

      try {
        const body = await readCapped(res, maxBytes)
        return { status: res.status, url: url.toString(), headers: res.headers, body }
      } catch (err) {
        if (controller.signal.aborted)
          throw new FetchTimeoutError(`Timed out after ${timeoutMs} ms`)
        throw err
      }
    }
  } finally {
    clearTimeout(timer)
  }
}
