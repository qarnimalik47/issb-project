/** POST /api/interview — start (or resume) a PIQ-based mock interview. Auth: required. */
import { route, requireUser, enforceRateLimit, json } from '@/lib/api/handler'
import { startInterview } from '@/lib/interview/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async () => {
  const user = await requireUser()
  await enforceRateLimit(`interview-start:${user.id}`, 20, 3600)
  const attempt = await startInterview(user.id)
  return json({ attempt }, { status: 201 })
})
