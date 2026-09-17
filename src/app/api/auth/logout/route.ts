/**
 * POST /api/auth/logout — revoke the current session. Auth: any (no-op if none).
 */
import { route, json } from '@/lib/api/handler'
import { endSession, getCurrentUser } from '@/lib/auth/session'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async () => {
  const user = await getCurrentUser()
  await endSession()
  if (user) await audit({ userId: user.id, action: 'auth.logout' })
  return json({ ok: true })
})
