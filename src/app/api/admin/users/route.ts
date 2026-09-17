/** GET /api/admin/users?q= — search users. Auth: admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { findUsers } from '@/lib/admin/ops'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const q = new URL(req.url).searchParams.get('q') ?? ''
  return json({ users: q ? await findUsers(q) : [] })
})
