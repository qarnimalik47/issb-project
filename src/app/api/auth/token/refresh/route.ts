/**
 * POST /api/auth/token/refresh — exchange a refresh token for a new access
 * token (and a rotated refresh token). Auth: public (bearer refresh token).
 */
import { route, readBody, clientIp, enforceRateLimit, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { z } from 'zod'
import { rotateRefreshToken, signAccessToken } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/identity'
import { eq } from 'drizzle-orm'
import { ACCESS_TOKEN_TTL_SECONDS } from '@/lib/auth/config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({ refreshToken: z.string().min(20).max(200) })

export const POST = route(async (req) => {
  await enforceRateLimit(`refresh:ip:${clientIp(req)}`, 60, 900)
  const { refreshToken } = await readBody(req, bodySchema)

  const rotated = await rotateRefreshToken(refreshToken)
  if (!rotated) throw new ApiError('unauthorized', 'Invalid or expired refresh token')

  const [user] = await db.select().from(users).where(eq(users.id, rotated.userId)).limit(1)
  if (!user || user.status === 'deleted') {
    throw new ApiError('unauthorized', 'Account unavailable')
  }

  const accessToken = await signAccessToken(user.id, user.role)
  return json({
    accessToken,
    refreshToken: rotated.refreshToken,
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  })
})
