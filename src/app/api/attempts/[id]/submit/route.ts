/**
 * POST /api/attempts/[id]/submit — submit and score server-side; returns the
 * explained result. Auth: required (owner only).
 */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { submitAttemptSchema } from '@/lib/validation/tests'
import { submitAttempt } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const { answers } = await readBody(req, submitAttemptSchema)
  try {
    const result = await submitAttempt(user.id, String(id), answers)
    return json({ result })
  } catch (err) {
    throw new ApiError('bad_request', err instanceof Error ? err.message : 'Could not submit')
  }
})
