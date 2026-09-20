import { describe, it, expect, vi } from 'vitest'
import { safeFetch, FetchPolicyError, FetchTooLargeError } from '../../src/lib/http/fetch'
import { assertPublicHttpsUrl, isPrivateAddress } from '../../src/lib/http/ssrf'
import { allowedDomainFor, assertEnvAllows } from '../../src/lib/scrape/policy'
import { entryFromFetch, evaluateRobots } from '../../src/lib/scrape/robots'

const publicDns = async () => [{ address: '93.184.216.34' }]

describe('allow-list gate (environment)', () => {
  const cfg = { enabled: true, allowedDomains: ['example.org'] }

  it('matches a domain and its subdomains only', () => {
    expect(allowedDomainFor('example.org', cfg.allowedDomains)).toBe('example.org')
    expect(allowedDomainFor('mcq.example.org', cfg.allowedDomains)).toBe('example.org')
    expect(allowedDomainFor('evilexample.org', cfg.allowedDomains)).toBeNull()
    expect(allowedDomainFor('example.org.evil.com', cfg.allowedDomains)).toBeNull()
  })

  it('refuses when the kill switch is off, whatever the list says', () => {
    expect(() =>
      assertEnvAllows(new URL('https://example.org/q'), { ...cfg, enabled: false }),
    ).toThrow(FetchPolicyError)
  })

  it('refuses a domain that is not listed — before any network call', async () => {
    const spy = vi.spyOn(globalThis, 'fetch')
    await expect(
      safeFetch('https://not-allowed.com/page', {
        checkUrl: (u) => {
          assertEnvAllows(u, cfg)
        },
      }),
    ).rejects.toBeInstanceOf(FetchPolicyError)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})

describe('SSRF hygiene', () => {
  it('classifies private and reserved addresses', () => {
    for (const ip of [
      '127.0.0.1',
      '10.1.2.3',
      '172.16.0.1',
      '192.168.1.1',
      '169.254.169.254',
      '100.64.0.1',
      '::1',
      'fd00::1',
      '::ffff:10.0.0.1',
    ]) {
      expect(isPrivateAddress(ip), ip).toBe(true)
    }
    for (const ip of ['8.8.8.8', '93.184.216.34', '2606:4700::1111']) {
      expect(isPrivateAddress(ip), ip).toBe(false)
    }
  })

  it('refuses http, credentials, IP literals, local names and private DNS answers', async () => {
    const reject = (u: string, dns = publicDns) =>
      expect(assertPublicHttpsUrl(new URL(u), dns)).rejects.toBeInstanceOf(FetchPolicyError)
    await reject('http://example.org/')
    await reject('https://user:pw@example.org/')
    await reject('https://93.184.216.34/')
    await reject('https://[::1]/')
    await reject('https://localhost/')
    await reject('https://printer.local/')
    await reject('https://example.org/', async () => [{ address: '10.0.0.5' }])
    await expect(
      assertPublicHttpsUrl(new URL('https://example.org/'), publicDns),
    ).resolves.toBeUndefined()
  })
})

describe('safeFetch', () => {
  const html = (body: string, init: ResponseInit = {}) => new Response(body, init)

  it('re-checks every redirect hop and stops at a forbidden one', async () => {
    const seen: string[] = []
    const fetchImpl = vi.fn(async (url: URL | RequestInfo) => {
      const u = String(url)
      if (u.endsWith('/start'))
        return html('', { status: 302, headers: { location: 'https://evil.test/x' } })
      return html('ok')
    })
    await expect(
      safeFetch('https://good.test/start', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        checkUrl: (u) => {
          seen.push(u.hostname)
          if (u.hostname !== 'good.test') throw new FetchPolicyError('blocked')
        },
      }),
    ).rejects.toBeInstanceOf(FetchPolicyError)
    expect(seen).toEqual(['good.test', 'evil.test'])
    expect(fetchImpl).toHaveBeenCalledTimes(1)
  })

  it('caps redirects', async () => {
    const fetchImpl = vi.fn(async () => html('', { status: 301, headers: { location: '/again' } }))
    await expect(
      safeFetch('https://loop.test/', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        maxRedirects: 2,
      }),
    ).rejects.toThrow(/More than 2 redirects/)
  })

  it('enforces the size cap while streaming', async () => {
    const fetchImpl = vi.fn(async () => html('x'.repeat(2048)))
    await expect(
      safeFetch('https://big.test/', {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        maxBytes: 1024,
      }),
    ).rejects.toBeInstanceOf(FetchTooLargeError)
  })

  it('returns the body and final URL', async () => {
    const fetchImpl = vi.fn(async () => html('<p>hi</p>', { status: 200 }))
    const r = await safeFetch('https://ok.test/a', {
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })
    expect(r.status).toBe(200)
    expect(r.body.toString()).toBe('<p>hi</p>')
    expect(r.url).toBe('https://ok.test/a')
  })
})

describe('robots.txt decisions', () => {
  const ua = 'ISSBPrepBot/0.1'
  const url = new URL('https://example.org/mcq/verbal')

  it('fails closed on server errors and unreachable robots.txt', () => {
    expect(evaluateRobots(entryFromFetch('error'), url, ua).allowed).toBe(false)
    expect(evaluateRobots(entryFromFetch({ status: 503, body: '' }), url, ua).allowed).toBe(false)
    expect(evaluateRobots(entryFromFetch({ status: 403, body: '' }), url, ua).allowed).toBe(false)
  })

  it('treats a missing robots.txt as allow-all', () => {
    expect(evaluateRobots(entryFromFetch({ status: 404, body: '' }), url, ua).allowed).toBe(true)
  })

  it('applies longest-match precedence and our user agent group', () => {
    const body = [
      'User-agent: *',
      'Disallow: /mcq/',
      'Allow: /mcq/verbal',
      '',
      'User-agent: ISSBPrepBot',
      'Disallow: /private/',
      'Crawl-delay: 10',
    ].join('\n')
    const entry = entryFromFetch({ status: 200, body })
    const d = evaluateRobots(entry, url, ua)
    expect(d.allowed).toBe(true)
    expect(d.crawlDelayMs).toBe(10_000)
    expect(evaluateRobots(entry, new URL('https://example.org/private/a'), ua).allowed).toBe(false)
    // Another bot is bound by the * group.
    expect(evaluateRobots(entry, new URL('https://example.org/mcq/gk'), 'OtherBot').allowed).toBe(
      false,
    )
  })
})
