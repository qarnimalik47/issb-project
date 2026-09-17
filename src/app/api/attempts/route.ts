/**
 * POST /api/attempts — start (or resume) an objective test attempt.
 * Auth: required.
 */
import { route, readBody, requireUser, enforceRateLimit, json } from '@/lib/api/handler'
import { startAttemptSchema } from '@/lib/validation/tests'
import { startAttempt } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const user = await requireUser()
  await enforceRateLimit(`attempt-start:${user.id}`, 30, 3600)
  const { testTypeId } = await readBody(req, startAttemptSchema)
  // Known problems throw typed ApiErrors; unexpected DB errors become a safe 500.
  const attempt = await startAttempt(user.id, testTypeId)
  return json({ attempt }, { status: 201 })
})
