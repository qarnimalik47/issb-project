/**
 * Auth domain service: registration and password authentication with account
 * lockout. Kept separate from route handlers so it is unit-testable.
 */
import { eq } from 'drizzle-orm'
import { db } from '../db/index'
import { users, consents, type User } from '../db/schema/identity'
import { hashPassword, verifyPassword } from './password'
import { ApiError, conflict } from '../api/errors'
import { isUniqueViolation } from '../db/errors'
import { LOGIN_MAX_FAILURES, LOGIN_LOCK_SECONDS, TERMS_VERSION, PRIVACY_VERSION } from './config'
import type { RegisterInput } from '../validation/auth'

export async function registerUser(input: RegisterInput, ip: string | null): Promise<User> {
  const passwordHash = await hashPassword(input.password)

  try {
    const [user] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        locale: input.locale,
        courseTrack: input.courseTrack,
        targetIssbDate: input.targetIssbDate,
      })
      .returning()

    if (!user) throw new ApiError('server_error', 'Failed to create account')

    await db.insert(consents).values({
      userId: user.id,
      termsVersion: TERMS_VERSION,
      privacyVersion: PRIVACY_VERSION,
      flags: input.consent,
      ip,
    })

    return user
  } catch (err) {
    // Unique violation on email/phone.
    if (isUniqueViolation(err)) {
      throw conflict('An account with that email or phone already exists')
    }
    throw err
  }
}

export type AuthResult =
  { ok: true; user: User } | { ok: false; reason: 'invalid' | 'locked' | 'deleted' }

/**
 * Authenticate by email + password, applying lockout. Returns a discriminated
 * result rather than throwing so the route can respond uniformly (no user
 * enumeration).
 */
export async function authenticate(email: string, password: string): Promise<AuthResult> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  // Always run a hash verify to reduce timing side-channels even when the user
  // does not exist.
  if (!user || !user.passwordHash) {
    await verifyPassword(
      '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$0000000000000000000000000000000000000000000',
      password,
    )
    return { ok: false, reason: 'invalid' }
  }

  if (user.status === 'deleted') return { ok: false, reason: 'deleted' }

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    return { ok: false, reason: 'locked' }
  }

  const valid = await verifyPassword(user.passwordHash, password)
  if (!valid) {
    const failures = user.failedLoginCount + 1
    const lock =
      failures >= LOGIN_MAX_FAILURES
        ? new Date(Date.now() + LOGIN_LOCK_SECONDS * 1000)
        : user.lockedUntil
    await db
      .update(users)
      .set({ failedLoginCount: failures, lockedUntil: lock, updatedAt: new Date() })
      .where(eq(users.id, user.id))
    return { ok: false, reason: failures >= LOGIN_MAX_FAILURES ? 'locked' : 'invalid' }
  }

  // Success → reset failure counter.
  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await db
      .update(users)
      .set({ failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() })
      .where(eq(users.id, user.id))
  }

  return { ok: true, user }
}
