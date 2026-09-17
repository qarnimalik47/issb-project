/**
 * GET /api/written/[id]/evaluations — per-item evaluation results for an
 * attempt. Auth: required (owner). Distress-blocked items carry no scores.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { getAttemptEvaluations } from '@/lib/eval/service'
import { SUPPORT_MESSAGE_EN, SUPPORT_MESSAGE_UR } from '@/lib/eval/distress'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const items = await getAttemptEvaluations(user.id, String(id))
  const hasDistress = items.some((i) => i.distress)
  return json({
    items,
    support: hasDistress ? { en: SUPPORT_MESSAGE_EN, ur: SUPPORT_MESSAGE_UR } : null,
  })
})
