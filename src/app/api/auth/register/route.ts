/**
 * POST /api/auth/register — create an account, start a session, send an email
 * verification OTP. Auth: public. Rate limited by IP.
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { registerSchema } from '@/lib/validation/auth'
import { registerUser } from '@/lib/auth/service'
import { startSession } from '@/lib/auth/session'
import { issueOtp } from '@/lib/auth/otp'
import { toPublicUser } from '@/lib/auth/serialize'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  await enforceRateLimit(`register:ip:${ip}`, 30, 3600)

  const input = await readBody(req, registerSchema)
  const user = await registerUser(input, ip)

  await startSession(user.id, { ip, userAgent: req.headers.get('user-agent') })
  await issueOtp({
    userId: user.id,
    channel: 'email',
    purpose: 'verify_email',
    to: user.email,
  })
  await audit({ userId: user.id, action: 'auth.register', ip })

  return json({ user: toPublicUser(user) }, { status: 201 })
})
