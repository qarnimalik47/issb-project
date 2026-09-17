/**
 * POST /api/auth/password/request — begin a password reset. Auth: public.
 * Always returns ok regardless of whether the email exists (no enumeration).
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { passwordResetRequestSchema } from '@/lib/validation/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/identity'
import { eq } from 'drizzle-orm'
import { issueOtp } from '@/lib/auth/otp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  const { email } = await readBody(req, passwordResetRequestSchema)
  await enforceRateLimit(`pwreset:ip:${ip}`, 10, 900)
  await enforceRateLimit(`pwreset:email:${email}`, 5, 900)

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (user && user.status !== 'deleted') {
    await issueOtp({ userId: user.id, channel: 'email', purpose: 'password_reset', to: email })
  }

  // Uniform response.
  return json({ ok: true })
})
