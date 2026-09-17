/**
 * OTP issuance and verification. Codes are hashed at rest; verification is
 * constant-time, attempt-limited, and single-use.
 */
import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '../db/index'
import { otpCodes } from '../db/schema/identity'
import { generateOtp, hashToken, safeEqualHex } from './tokens'
import { sendOtp } from '../notify/index'
import { OTP_TTL_SECONDS, OTP_MAX_ATTEMPTS } from './config'

type Channel = 'email' | 'phone'
type Purpose = 'verify_email' | 'verify_phone' | 'login' | 'password_reset'

export async function issueOtp(params: {
  userId: string
  channel: Channel
  purpose: Purpose
  to: string
}): Promise<void> {
  const code = generateOtp(6)
  const codeHash = hashToken(code)
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000)

  await db.insert(otpCodes).values({
    userId: params.userId,
    channel: params.channel,
    purpose: params.purpose,
    codeHash,
    expiresAt,
  })

  await sendOtp({
    userId: params.userId,
    channel: params.channel,
    to: params.to,
    code,
    purpose: params.purpose,
  })
}

export type OtpVerifyResult =
  { ok: true } | { ok: false; reason: 'not_found' | 'expired' | 'too_many_attempts' | 'mismatch' }

export async function verifyOtp(params: {
  userId: string
  purpose: Purpose
  code: string
}): Promise<OtpVerifyResult> {
  // Newest unconsumed code for this purpose.
  const [row] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.userId, params.userId),
        eq(otpCodes.purpose, params.purpose),
        isNull(otpCodes.consumedAt),
      ),
    )
    .orderBy(desc(otpCodes.createdAt))
    .limit(1)

  if (!row) return { ok: false, reason: 'not_found' }
  if (row.expiresAt.getTime() < Date.now()) return { ok: false, reason: 'expired' }
  if (row.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: 'too_many_attempts' }

  const matches = safeEqualHex(row.codeHash, hashToken(params.code))
  if (!matches) {
    await db
      .update(otpCodes)
      .set({ attempts: row.attempts + 1 })
      .where(eq(otpCodes.id, row.id))
    return { ok: false, reason: 'mismatch' }
  }

  await db.update(otpCodes).set({ consumedAt: new Date() }).where(eq(otpCodes.id, row.id))
  return { ok: true }
}
