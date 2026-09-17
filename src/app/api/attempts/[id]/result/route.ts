/**
 * GET /api/attempts/[id]/result — the explained result (only after submission).
 * Auth: required (owner only).
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { getResult } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  try {
    const result = await getResult(user.id, String(id))
    return json({ result })
  } catch (err) {
    throw new ApiError('bad_request', err instanceof Error ? err.message : 'No result')
  }
})
