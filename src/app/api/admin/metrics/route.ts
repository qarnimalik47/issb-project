/** GET /api/admin/metrics?days=30 — business + operational dashboard metrics. Auth: admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { dashboardMetrics } from '@/lib/admin/metrics'
import { systemSnapshot } from '@/lib/admin/system'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const days = Number(new URL(req.url).searchParams.get('days') ?? 30)
  const window = [7, 30, 90].includes(days) ? days : 30
  const [metrics, system] = await Promise.all([dashboardMetrics(window), systemSnapshot()])
  return json({
    ...metrics,
    health: system.health,
    queues: system.queues,
    content: system.content,
    expertReviews: system.expertReviews,
  })
})
