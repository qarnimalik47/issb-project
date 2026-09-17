/**
 * POST /api/auth/login — authenticate by email + password. Auth: public.
 * Rate limited by IP and email. Uniform responses to avoid user enumeration.
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { loginSchema } from '@/lib/validation/auth'
import { authenticate } from '@/lib/auth/service'
import { startSession } from '@/lib/auth/session'
import { toPublicUser } from '@/lib/auth/serialize'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  const { email, password } = await readBody(req, loginSchema)

  await enforceRateLimit(`login:ip:${ip}`, 20, 900)
  await enforceRateLimit(`login:email:${email}`, 10, 900)

  const result = await authenticate(email, password)
  if (!result.ok) {
    if (result.reason === 'locked') {
      await audit({ action: 'auth.login.locked', metadata: { email }, ip })
      throw new ApiError('forbidden', 'Account temporarily locked due to repeated failures')
    }
    throw new ApiError('unauthorized', 'Invalid email or password')
  }

  await startSession(result.user.id, { ip, userAgent: req.headers.get('user-agent') })
  await audit({ userId: result.user.id, action: 'auth.login', ip })

  return json({ user: toPublicUser(result.user) })
})
