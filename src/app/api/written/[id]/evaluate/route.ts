/**
 * POST /api/written/[id]/evaluate — request AI evaluation of a submitted
 * written attempt. Quota is enforced (and consumed) before any AI call is
 * queued. Auth: required (owner). Paid feature.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { requestEvaluation } from '@/lib/eval/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const result = await requestEvaluation(user.id, String(id))
  await audit({ userId: user.id, action: 'eval.request', targetId: String(id) })
  return json(result, { status: 202 })
})
