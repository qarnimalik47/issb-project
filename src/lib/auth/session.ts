/**
 * Web session management (server-side sessions in an http-only cookie).
 * The raw token is only ever in the cookie; the DB stores its hash.
 */
import { cookies, headers } from 'next/headers'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { db } from '../db/index'
import { sessions, users, type User } from '../db/schema/identity'
import { verifyAccessToken } from './jwt'
import { generateToken, hashToken } from './tokens'
import { isProduction } from '../env/index'
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from './config'

/** Create a session row and return the raw token (caller sets the cookie). */
export async function createSessionToken(
  userId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {},
): Promise<string> {
  const token = generateToken(32)
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000)
  await db.insert(sessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
    ip: meta.ip ?? null,
    userAgent: meta.userAgent ?? null,
  })
  return token
}

/** Create a session and set the cookie in one step (request context). */
export async function startSession(
  userId: string,
  meta: { ip?: string | null; userAgent?: string | null } = {},
): Promise<void> {
  const token = await createSessionToken(userId, meta)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
}

/** Resolve the user for a raw session token, or null if invalid/expired. */
export async function getUserForToken(token: string): Promise<User | null> {
  const tokenHash = hashToken(token)
  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1)
  if (!row) return null
  if (row.user.status === 'deleted') return null
  return row.user
}

/** Resolve the user for a mobile Bearer JWT (Authorization header), or null. */
async function getUserForBearer(): Promise<User | null> {
  const h = await headers()
  const auth = h.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const payload = await verifyAccessToken(auth.slice(7))
  if (!payload) return null
  const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1)
  if (!user || user.status === 'deleted') return null
  return user
}

/**
 * Resolve the current user from either a web session cookie OR a mobile Bearer
 * JWT. This lets every route serve both clients (build prompt: shared API).
 */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    const user = await getUserForToken(token)
    if (user) return user
  }
  return getUserForBearer()
}

/** Revoke the current session and clear the cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.tokenHash, hashToken(token)))
    store.delete(SESSION_COOKIE)
  }
}
