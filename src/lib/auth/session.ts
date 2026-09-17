/**
 * Web session management (server-side sessions in an http-only cookie).
 * The raw token is only ever in the cookie; the DB stores its hash.
 */
import { cookies } from 'next/headers'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { db } from '../db/index'
import { sessions, users, type User } from '../db/schema/identity'
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

/** Read the current session cookie and resolve the user (or null). */
export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return getUserForToken(token)
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
