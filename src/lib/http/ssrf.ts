/**
 * Server-side request forgery hygiene for any URL the server fetches on an
 * admin's say-so. Only public HTTPS hosts by name: no plain HTTP, no embedded
 * credentials, no IP literals, and no hostname that resolves into a private,
 * loopback, link-local or otherwise reserved range — which would turn the
 * crawler into a way to probe this machine or its network.
 *
 * Checked on the first URL and again on every redirect hop (see safeFetch).
 * A DNS answer can still change between this check and the connection
 * (rebinding); the allow-list gates in front of this make that a narrow window
 * limited to domains an operator deliberately enabled.
 */
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { FetchPolicyError } from './fetch'

function ipv4Private(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number) as [number, number]
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, incl. cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    a >= 224 // multicast and reserved
  )
}

function ipv6Private(ip: string): boolean {
  const v = ip.toLowerCase()
  if (v === '::' || v === '::1') return true
  if (v.startsWith('::ffff:')) return ipv4Private(v.slice(7))
  return /^(fc|fd|fe[89ab]|ff)/.test(v) // unique-local, link-local, multicast
}

/** True for any address that is not publicly routable. */
export function isPrivateAddress(ip: string): boolean {
  const family = isIP(ip)
  if (family === 4) return ipv4Private(ip)
  if (family === 6) return ipv6Private(ip)
  return true
}

type Resolver = (host: string) => Promise<{ address: string }[]>
const defaultResolver: Resolver = (host) => lookup(host, { all: true, verbatim: true })

export async function assertPublicHttpsUrl(url: URL, resolve: Resolver = defaultResolver) {
  if (url.protocol !== 'https:') throw new FetchPolicyError('Only https:// URLs may be fetched')
  if (url.username || url.password) throw new FetchPolicyError('URLs with credentials are refused')
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase()
  if (isIP(host)) throw new FetchPolicyError('IP-address URLs are refused; use a domain name')
  if (host === 'localhost' || /\.(localhost|local|internal|home|lan)$/.test(host)) {
    throw new FetchPolicyError('Local hostnames are refused')
  }
  let addresses: { address: string }[]
  try {
    addresses = await resolve(host)
  } catch {
    throw new FetchPolicyError(`Could not resolve ${host}`)
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new FetchPolicyError(`${host} resolves to a private or reserved address`)
  }
}
