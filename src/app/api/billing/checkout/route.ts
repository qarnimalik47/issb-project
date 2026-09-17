/**
 * POST /api/billing/checkout — begin a subscription purchase. Creates a pending
 * payment and returns gateway checkout info. Auth: required.
 */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { z } from 'zod'
import { createCheckout } from '@/lib/billing/subscriptions'
import { signMock } from '@/lib/billing/gateways'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  planCode: z.enum(['paid', 'premium']),
  gateway: z.enum(['mock', 'jazzcash', 'easypaisa', 'card']).default('mock'),
})

export const POST = route(async (req) => {
  const user = await requireUser()
  const { planCode, gateway } = await readBody(req, schema)
  const { paymentId, gatewayRef } = await createCheckout(user.id, planCode, gateway)
  await audit({ userId: user.id, action: 'billing.checkout', metadata: { planCode, gateway } })

  // Mock gateway: return a self-hosted confirm URL that simulates the callback.
  const checkoutUrl =
    gateway === 'mock'
      ? `/api/billing/mock/confirm?ref=${gatewayRef}&sig=${signMock(gatewayRef)}`
      : null

  return json({ paymentId, gatewayRef, checkoutUrl }, { status: 201 })
})
