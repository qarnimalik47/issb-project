/**
 * GET  /api/admin/credits — balances, ledger and headline credit figures.
 * POST /api/admin/credits — grant or deduct credits for one user, a list of
 *                           email addresses, or everyone on a plan.
 * Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { ApiError } from '@/lib/api/errors'
import { applyCredits, creditStats, recentLedger, topBalances } from '@/lib/billing/credits'
import { resolveUserIds, userIdsOnPlan } from '@/lib/admin/users'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** A single grant is capped so a slipped keystroke cannot mint a fortune. */
const MAX_PER_USER = 10_000
/** And a bulk grant is capped on how many accounts one action may touch. */
const MAX_AUDIENCE = 5_000

const schema = z.object({
  amount: z
    .number()
    .int()
    .refine((n) => n !== 0, 'Enter a non-zero amount')
    .refine((n) => Math.abs(n) <= MAX_PER_USER, `At most ${MAX_PER_USER} credits per account`),
  reason: z.string().min(1).max(200),
  target: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('user'), userId: z.uuid() }),
    z.object({ kind: z.literal('emails'), emails: z.array(z.email()).min(1).max(500) }),
    z.object({ kind: z.literal('plan'), planCode: z.enum(['free', 'paid', 'premium']) }),
  ]),
})

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const p = new URL(req.url).searchParams
  const [stats, ledger, balances] = await Promise.all([
    creditStats(),
    recentLedger({
      kind: p.get('kind') || undefined,
      limit: Math.min(200, Number(p.get('limit') ?? 50) || 50),
      offset: Number(p.get('offset') ?? 0) || 0,
    }),
    topBalances(25),
  ])
  return json({ stats, ledger, balances })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const body = await readBody(req, schema)

  let userIds: string[]
  let unmatched: string[] = []
  if (body.target.kind === 'user') {
    userIds = [body.target.userId]
  } else if (body.target.kind === 'emails') {
    const wanted = body.target.emails.map((e) => e.toLowerCase().trim())
    const found = await resolveUserIds(wanted)
    userIds = found.map((f) => f.id)
    const foundEmails = new Set(found.map((f) => f.email.toLowerCase()))
    unmatched = wanted.filter((e) => !foundEmails.has(e))
  } else {
    userIds = await userIdsOnPlan(body.target.planCode)
  }

  if (userIds.length === 0) {
    throw new ApiError('bad_request', 'That selection matched no accounts')
  }
  if (userIds.length > MAX_AUDIENCE) {
    throw new ApiError(
      'bad_request',
      `That selection covers ${userIds.length} accounts — too many for one grant`,
    )
  }

  for (const userId of userIds) {
    await applyCredits({
      userId,
      delta: body.amount,
      kind: body.amount > 0 ? 'grant' : 'adjustment',
      reason: body.reason,
      actorId: admin.id,
      metadata: { bulk: body.target.kind !== 'user' },
    })
  }

  await audit({
    userId: admin.id,
    action: 'admin.credits',
    targetType: 'credits',
    targetId: body.target.kind,
    metadata: { amount: body.amount, accounts: userIds.length, reason: body.reason },
    ip: clientIp(req),
  })

  return json({ ok: true, accounts: userIds.length, unmatched })
})
