/**
 * GET /api/me/analytics?testTypeId= — per-topic accuracy across the user's
 * evaluated attempts. Auth: required.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { getTopicAnalytics } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  const user = await requireUser()
  const url = new URL(req.url)
  const testTypeId = url.searchParams.get('testTypeId') ?? undefined
  const analytics = await getTopicAnalytics(user.id, testTypeId)
  return json(analytics)
})
