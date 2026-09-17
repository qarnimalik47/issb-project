/**
 * POST /api/billing/webhook/[gateway] — real gateway webhook (JazzCash /
 * Easypaisa / card). Verifies the signature and applies the payment
 * idempotently. Auth: public but signature-verified. Never trusts the client.
 */
import { route, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { verifyGatewaySignature, type Gateway } from '@/lib/billing/gateways'
import { applyPaidWebhook } from '@/lib/billing/subscriptions'
import { childLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const log = childLogger('billing-webhook')

export const POST = route(async (req, ctx) => {
  const { gateway } = await ctx.params
  const g = String(gateway) as Gateway
  if (g !== 'jazzcash' && g !== 'easypaisa' && g !== 'card') {
    throw new ApiError('not_found', 'Unknown gateway')
  }

  const params = (await req.json().catch(() => ({}))) as Record<string, string>
  const providedHash = params.pp_SecureHash ?? params.secureHash ?? ''
  const gatewayRef = params.pp_TxnRefNo ?? params.orderRefNum ?? params.gatewayRef ?? ''

  if (!verifyGatewaySignature(g, params, providedHash)) {
    log.warn({ gateway: g }, 'webhook signature verification failed')
    throw new ApiError('forbidden', 'Invalid signature')
  }
  if (!gatewayRef) throw new ApiError('bad_request', 'Missing transaction reference')

  const applied = await applyPaidWebhook(g, gatewayRef, params)
  return json({ ok: true, applied })
})
