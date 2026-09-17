/**
 * /api/me — current user's profile.
 *   GET    → profile
 *   PATCH  → update name/locale/course track/target date
 *   DELETE → permanently delete the account and its data (rule 4.8)
 * Auth: required.
 */
import { route, readBody, requireUser, clientIp, json } from '@/lib/api/handler'
import { profileUpdateSchema } from '@/lib/validation/auth'
import { toPublicUser } from '@/lib/auth/serialize'
import { endSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema/identity'
import { eq } from 'drizzle-orm'
import { hashToken } from '@/lib/auth/tokens'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const user = await requireUser()
  return json({ user: toPublicUser(user) })
})

export const PATCH = route(async (req) => {
  const user = await requireUser()
  const patch = await readBody(req, profileUpdateSchema)
  const [updated] = await db
    .update(users)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning()
  await audit({ userId: user.id, action: 'profile.update', ip: clientIp(req) })
  return json({ user: toPublicUser(updated!) })
})

export const DELETE = route(async (req) => {
  const user = await requireUser()
  const ip = clientIp(req)
  // Audit before deletion (userId FK becomes null via ON DELETE SET NULL).
  await audit({
    userId: user.id,
    action: 'account.delete',
    metadata: { emailHash: hashToken(user.email) },
    ip,
  })
  // Cascades remove sessions, consents, OTPs, attempts, responses, evaluations.
  await db.delete(users).where(eq(users.id, user.id))
  await endSession()
  return json({ ok: true })
})
