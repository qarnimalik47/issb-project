/** GET /api/admin/metrics — business + operational dashboard metrics. Auth: admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { businessMetrics } from '@/lib/admin/ops'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['admin'])
  return json(await businessMetrics())
})
