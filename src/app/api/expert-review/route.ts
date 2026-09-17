/** POST /api/expert-review — request human expert review (Premium). Auth: required. */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { z } from 'zod'
import { requestExpertReview } from '@/lib/billing/expert'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  subjectType: z.enum(['attempt', 'written_response']),
  subjectId: z.uuid(),
})

export const POST = route(async (req) => {
  const user = await requireUser()
  const { subjectType, subjectId } = await readBody(req, schema)
  const id = await requestExpertReview(user.id, subjectType, subjectId)
  await audit({ userId: user.id, action: 'expert_review.request', targetId: id })
  return json({ id }, { status: 201 })
})
