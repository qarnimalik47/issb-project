/**
 * POST /api/auth/password/confirm — complete a password reset with the OTP.
 * Auth: public. On success, revokes all existing sessions.
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { passwordResetConfirmSchema } from '@/lib/validation/auth'
import { db } from '@/lib/db'
import { users, sessions } from '@/lib/db/schema/identity'
import { eq, and, isNull } from 'drizzle-orm'
import { verifyOtp } from '@/lib/auth/otp'
import { hashPassword } from '@/lib/auth/password'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  const { email, code, password } = await readBody(req, passwordResetConfirmSchema)
  await enforceRateLimit(`pwreset-confirm:ip:${ip}`, 10, 900)

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (!user) throw new ApiError('bad_request', 'Invalid reset request')

  const result = await verifyOtp({ userId: user.id, purpose: 'password_reset', code })
  if (!result.ok) throw new ApiError('bad_request', `Reset failed: ${result.reason}`)

  const passwordHash = await hashPassword(password)
  await db
    .update(users)
    .set({ passwordHash, failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(users.id, user.id))

  // Revoke all active sessions for safety.
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, user.id), isNull(sessions.revokedAt)))

  await audit({ userId: user.id, action: 'auth.password_reset', ip })
  return json({ ok: true })
})
