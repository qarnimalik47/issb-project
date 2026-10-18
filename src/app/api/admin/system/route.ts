/** GET /api/admin/system — dependency health, queues, storage, backlog. Auth: admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { systemSnapshot } from '@/lib/admin/system'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['admin'])
  return json(await systemSnapshot())
})
