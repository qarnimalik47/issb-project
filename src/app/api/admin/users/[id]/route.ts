/**
 * /api/admin/users/[id]
 *   GET  → user detail (subscription, notes, payments)
 *   POST → operation: grant plan | add note | refund | re-evaluate
 * Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { getUserDetail, grantPlan, addSupportNote, reevaluateAttempt } from '@/lib/admin/ops'
import { refundPayment } from '@/lib/billing/subscriptions'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('grant'), planCode: z.enum(['free', 'paid', 'premium']) }),
  z.object({ action: z.literal('note'), note: z.string().min(1).max(4000) }),
  z.object({ action: z.literal('refund'), paymentId: z.uuid() }),
  z.object({ action: z.literal('reeval'), attemptId: z.uuid() }),
])

export const GET = route(async (_req, ctx) => {
  await requireRole(['admin'])
  const { id } = await ctx.params
  return json(await getUserDetail(String(id)))
})

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  const userId = String(id)
  const body = await readBody(req, schema)
  const ip = clientIp(req)

  switch (body.action) {
    case 'grant':
      await grantPlan(userId, body.planCode)
      break
    case 'note':
      await addSupportNote(userId, admin.id, body.note)
      break
    case 'refund':
      await refundPayment(body.paymentId)
      break
    case 'reeval':
      await reevaluateAttempt(body.attemptId)
      break
  }
  await audit({
    userId: admin.id,
    action: `admin.${body.action}`,
    targetType: 'user',
    targetId: userId,
    ip,
  })
  return json({ ok: true })
})
