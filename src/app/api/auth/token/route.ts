/**
 * POST /api/auth/token — mobile login. Exchanges email+password for a JWT
 * access token and an opaque refresh token. Auth: public. Rate limited.
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { loginSchema } from '@/lib/validation/auth'
import { authenticate } from '@/lib/auth/service'
import { signAccessToken, issueRefreshToken } from '@/lib/auth/jwt'
import { toPublicUser } from '@/lib/auth/serialize'
import { ACCESS_TOKEN_TTL_SECONDS } from '@/lib/auth/config'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const ip = clientIp(req)
  const { email, password } = await readBody(req, loginSchema)
  await enforceRateLimit(`token:ip:${ip}`, 20, 900)
  await enforceRateLimit(`token:email:${email}`, 10, 900)

  const result = await authenticate(email, password)
  if (!result.ok) {
    if (result.reason === 'locked') {
      throw new ApiError('forbidden', 'Account temporarily locked')
    }
    throw new ApiError('unauthorized', 'Invalid email or password')
  }

  const accessToken = await signAccessToken(result.user.id, result.user.role)
  const refreshToken = await issueRefreshToken(result.user.id)
  await audit({ userId: result.user.id, action: 'auth.token.issue', ip })

  return json({
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    user: toPublicUser(result.user),
  })
})
