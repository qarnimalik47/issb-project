/**
 * GET  /api/admin/billing?days=30 — revenue, gateways, the subscription book.
 * POST /api/admin/billing        — refund a payment.
 * Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { billingOverview } from '@/lib/admin/metrics'
import { refundPayment } from '@/lib/billing/subscriptions'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({ action: z.literal('refund'), paymentId: z.uuid() })

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const days = Number(new URL(req.url).searchParams.get('days') ?? 30)
  return json(await billingOverview([7, 30, 90].includes(days) ? days : 30))
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const body = await readBody(req, schema)
  await refundPayment(body.paymentId)
  await audit({
    userId: admin.id,
    action: 'admin.refund',
    targetType: 'payment',
    targetId: body.paymentId,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
