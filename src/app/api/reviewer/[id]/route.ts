/** POST /api/reviewer/[id] — claim or submit an expert review. Auth: expert_reviewer/admin. */
import { route, readBody, requireRole, json } from '@/lib/api/handler'
import { z } from 'zod'
import { claimReview, submitReview } from '@/lib/billing/expert'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('claim') }),
  z.object({
    action: z.literal('submit'),
    feedback: z.string().min(1).max(8000),
    rating: z.number().int().min(1).max(5),
  }),
])

export const POST = route(async (req, ctx) => {
  const reviewer = await requireRole(['expert_reviewer', 'admin'])
  const { id } = await ctx.params
  const body = await readBody(req, schema)
  if (body.action === 'claim') {
    await claimReview(String(id), reviewer.id)
  } else {
    await submitReview(String(id), reviewer.id, body.feedback, body.rating)
    await audit({ userId: reviewer.id, action: 'expert_review.submit', targetId: String(id) })
  }
  return json({ ok: true })
})
