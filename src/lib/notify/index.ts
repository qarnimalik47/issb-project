/**
 * Notification delivery (OTP codes, links) via a pluggable adapter.
 *
 * Phase 1 ships a `console` adapter that logs the message and, in development
 * only, caches the last code in Redis so automated/manual tests can complete
 * the OTP flow without a real email/SMS provider. Real providers (email, SMS)
 * are added behind this same interface when credentials are provisioned — the
 * choice is explicit configuration, never a silent fake (rule 1.1).
 */
import { childLogger } from '../logger/index'
import { redis, ensureRedis } from '../redis/index'
import { isProduction } from '../env/index'

const log = childLogger('notify')

export type OtpMessage = {
  userId: string
  channel: 'email' | 'phone'
  to: string
  code: string
  purpose: string
}

const DEV_OTP_TTL_SECONDS = 600

function devOtpKey(userId: string): string {
  return `dev:last-otp:${userId}`
}

export async function sendOtp(msg: OtpMessage): Promise<void> {
  // Never log the actual code in production. In dev, surface it for convenience.
  log.info(
    { channel: msg.channel, purpose: msg.purpose, to: maskAddress(msg.to) },
    'OTP dispatched',
  )
  if (!isProduction) {
    console.warn(`[dev-notify] OTP for ${msg.to} (${msg.purpose}): ${msg.code}`)
    await ensureRedis()
    await redis.set(devOtpKey(msg.userId), msg.code, 'EX', DEV_OTP_TTL_SECONDS)
  }
}

/** Development-only helper for tests to retrieve the last OTP. */
export async function getLastDevOtp(userId: string): Promise<string | null> {
  if (isProduction) return null
  await ensureRedis()
  return redis.get(devOtpKey(userId))
}

function maskAddress(addr: string): string {
  if (addr.includes('@')) {
    const [name, domain] = addr.split('@')
    return `${(name ?? '').slice(0, 2)}***@${domain ?? ''}`
  }
  return `***${addr.slice(-3)}`
}
