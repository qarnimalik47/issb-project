/**
 * Mobile auth tokens: short-lived JWT access tokens (HS256, signed with
 * SESSION_SECRET) plus opaque, rotating refresh tokens stored hashed in the DB.
 * Prepared in Phase 1; consumed by the mobile app in Phase 10.
 */
import { SignJWT, jwtVerify } from 'jose'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { db } from '../db/index'
import { refreshTokens } from '../db/schema/identity'
import { env } from '../env/index'
import { generateToken, hashToken } from './tokens'
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TTL_SECONDS } from './config'

const secretKey = new TextEncoder().encode(env.SESSION_SECRET)
const ISSUER = 'issb'
const AUDIENCE = 'issb-mobile'

export async function signAccessToken(userId: string, role: string): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secretKey)
}

export async function verifyAccessToken(
  token: string,
): Promise<{ userId: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: ISSUER,
      audience: AUDIENCE,
    })
    if (!payload.sub) return null
    return { userId: payload.sub, role: String(payload.role ?? 'student') }
  } catch {
    return null
  }
}

/** Issue a new opaque refresh token (returns the raw token). */
export async function issueRefreshToken(userId: string): Promise<string> {
  const token = generateToken(32)
  await db.insert(refreshTokens).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + REFRESH_TTL_SECONDS * 1000),
  })
  return token
}

/**
 * Rotate a refresh token: validate it, revoke it, issue a fresh one. Returns
 * the userId + new token, or null if the presented token is invalid.
 */
export async function rotateRefreshToken(
  token: string,
): Promise<{ userId: string; refreshToken: string } | null> {
  const [row] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.tokenHash, hashToken(token)),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      ),
    )
    .limit(1)
  if (!row) return null

  await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.id, row.id))
  const refreshToken = await issueRefreshToken(row.userId)
  return { userId: row.userId, refreshToken }
}
