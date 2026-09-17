/**
 * POST /api/auth/otp/confirm — confirm an email/phone verification OTP.
 * Auth: required. Rate limited per user.
 */
import { route, readBody, requireUser, enforceRateLimit, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { otpConfirmSchema } from '@/lib/validation/auth'
import { verifyOtp } from '@/lib/auth/otp'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/identity'
import { eq } from 'drizzle-orm'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const user = await requireUser()
  const ip = clientIp(req)
  const { purpose, code } = await readBody(req, otpConfirmSchema)
  await enforceRateLimit(`otp-confirm:user:${user.id}`, 10, 900)

  if (purpose !== 'verify_email' && purpose !== 'verify_phone') {
    throw new ApiError('bad_request', 'Unsupported purpose for this endpoint')
  }

  const result = await verifyOtp({ userId: user.id, purpose, code })
  if (!result.ok) {
    throw new ApiError('bad_request', `Verification failed: ${result.reason}`)
  }

  const field =
    purpose === 'verify_email' ? { emailVerifiedAt: new Date() } : { phoneVerifiedAt: new Date() }
  await db
    .update(users)
    .set({ ...field, updatedAt: new Date() })
    .where(eq(users.id, user.id))

  await audit({ userId: user.id, action: `auth.${purpose}`, ip })
  return json({ ok: true })
})
