/** GET /api/reviewer — the expert reviewer's work queue. Auth: expert_reviewer/admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { reviewerQueue } from '@/lib/billing/expert'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const reviewer = await requireRole(['expert_reviewer', 'admin'])
  return json({ queue: await reviewerQueue(reviewer.id) })
})
