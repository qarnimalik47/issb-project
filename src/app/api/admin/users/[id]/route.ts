/**
 * /api/admin/users/[id]
 *   GET  → full account profile (subscription, payments, credits, sessions, notes)
 *   POST → one support action against the account
 * Auth: admin. Every action is written to the audit log.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { ApiError } from '@/lib/api/errors'
import { grantPlan, addSupportNote, reevaluateAttempt } from '@/lib/admin/ops'
import {
  revokeSessions,
  setUserRole,
  setUserStatus,
  unlockUser,
  userProfile,
} from '@/lib/admin/users'
import { applyCredits } from '@/lib/billing/credits'
import { refundPayment } from '@/lib/billing/subscriptions'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('grant'), planCode: z.enum(['free', 'paid', 'premium']) }),
  z.object({ action: z.literal('note'), note: z.string().min(1).max(4000) }),
  z.object({ action: z.literal('refund'), paymentId: z.uuid() }),
  z.object({ action: z.literal('reeval'), attemptId: z.uuid() }),
  z.object({ action: z.literal('status'), status: z.enum(['active', 'locked', 'deleted']) }),
  z.object({
    action: z.literal('role'),
    role: z.enum(['student', 'content_editor', 'expert_reviewer', 'admin']),
  }),
  z.object({ action: z.literal('unlock') }),
  z.object({ action: z.literal('revoke_sessions') }),
  z.object({
    action: z.literal('credits'),
    delta: z
      .number()
      .int()
      .refine((n) => n !== 0, 'Enter a non-zero amount'),
    reason: z.string().min(1).max(200),
  }),
])

export const GET = route(async (_req, ctx) => {
  await requireRole(['admin'])
  const { id } = await ctx.params
  const profile = await userProfile(String(id))
  if (!profile) throw new ApiError('not_found', 'No such user')
  return json(profile)
})

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  const userId = String(id)
  const body = await readBody(req, schema)
  const ip = clientIp(req)
  const metadata: Record<string, unknown> = {}

  switch (body.action) {
    case 'grant':
      await grantPlan(userId, body.planCode)
      metadata.planCode = body.planCode
      break
    case 'note':
      await addSupportNote(userId, admin.id, body.note)
      break
    case 'refund':
      await refundPayment(body.paymentId)
      metadata.paymentId = body.paymentId
      break
    case 'reeval':
      metadata.queued = await reevaluateAttempt(body.attemptId)
      break
    case 'status':
      // An admin locking themselves out would leave the panel unreachable.
      if (userId === admin.id && body.status !== 'active') {
        throw new ApiError('bad_request', 'You cannot suspend your own account')
      }
      await setUserStatus(userId, body.status)
      metadata.status = body.status
      break
    case 'role':
      if (userId === admin.id && body.role !== 'admin') {
        throw new ApiError('bad_request', 'You cannot remove your own admin role')
      }
      await setUserRole(userId, body.role)
      metadata.role = body.role
      break
    case 'unlock':
      await unlockUser(userId)
      break
    case 'revoke_sessions':
      metadata.revoked = await revokeSessions(userId)
      break
    case 'credits':
      metadata.balance = await applyCredits({
        userId,
        delta: body.delta,
        kind: body.delta > 0 ? 'grant' : 'adjustment',
        reason: body.reason,
        actorId: admin.id,
      })
      metadata.delta = body.delta
      break
  }

  await audit({
    userId: admin.id,
    action: `admin.${body.action}`,
    targetType: 'user',
    targetId: userId,
    metadata,
    ip,
  })
  return json({ ok: true, ...metadata })
})
