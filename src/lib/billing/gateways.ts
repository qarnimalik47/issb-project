/**
 * Payment gateway abstraction. Real gateways (JazzCash, Easypaisa, card) plug in
 * behind webhook signature verification; a `mock` gateway lets the full billing
 * flow run end-to-end locally without live credentials (which the product owner
 * provisions — backlog Q4/Q10). No real charge ever happens with `mock`.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { env } from '../env/index'

export type Gateway = 'mock' | 'jazzcash' | 'easypaisa' | 'card'
export const GATEWAYS: Gateway[] = ['mock', 'jazzcash', 'easypaisa', 'card']

export function generateGatewayRef(): string {
  return 'ref_' + randomBytes(12).toString('hex')
}

function hmac(secret: string, data: string): string {
  return createHmac('sha256', secret).update(data).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

/** Sign a mock checkout so our own confirm endpoint can trust it. */
export function signMock(ref: string): string {
  return hmac(env.SESSION_SECRET, `mock:${ref}`)
}
export function verifyMock(ref: string, sig: string): boolean {
  return safeEqual(signMock(ref), sig)
}

/**
 * Verify a real gateway webhook signature. JazzCash/Easypaisa use an HMAC/secure
 * hash over sorted parameters with a merchant integrity salt. We implement the
 * generic HMAC-SHA256 check; the exact field ordering is finalised against the
 * gateway's live docs when credentials are provided.
 */
export function verifyGatewaySignature(
  gateway: Gateway,
  params: Record<string, string>,
  providedHash: string,
): boolean {
  const salt =
    gateway === 'jazzcash'
      ? process.env.JAZZCASH_INTEGRITY_SALT
      : gateway === 'easypaisa'
        ? process.env.EASYPAISA_INTEGRITY_SALT
        : undefined
  if (!salt) return false
  const sorted = Object.keys(params)
    .filter((k) => k !== 'pp_SecureHash' && k !== 'secureHash')
    .sort()
    .map((k) => params[k])
    .join('&')
  const expected = hmac(salt, sorted)
  return safeEqual(expected, providedHash.toLowerCase())
}
