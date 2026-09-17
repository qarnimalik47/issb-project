/**
 * Opaque token generation and hashing.
 *
 * We hand the raw token to the client (session cookie, refresh token, reset
 * link) but only ever store its SHA-256 hash, so a database leak does not
 * expose usable credentials. OTP codes are short numeric codes hashed the same
 * way.
 */
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto'

/** A high-entropy URL-safe token (default 32 bytes → 43 chars base64url). */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

/** Deterministic hash used for lookup/storage of tokens. */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** A numeric OTP code, zero-padded to `digits` length. */
export function generateOtp(digits = 6): string {
  const max = 10 ** digits
  // Rejection-free enough for a 6-digit code; uniform via modulo of 4 bytes.
  const n = randomBytes(4).readUInt32BE(0) % max
  return n.toString().padStart(digits, '0')
}

/** Constant-time comparison of two hex hashes. */
export function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'hex')
  const bb = Buffer.from(b, 'hex')
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}
