/**
 * GET /api/attempts/[id] — resume/get an attempt for the player (no answer key).
 * Auth: required (owner only).
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { getAttemptForPlayer } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  try {
    const attempt = await getAttemptForPlayer(user.id, String(id))
    return json({ attempt })
  } catch {
    throw new ApiError('not_found', 'Attempt not found')
  }
})
