/**
 * GET /api/billing/mock/confirm — simulates the mock gateway's callback after a
 * "successful payment". Verifies our signature, applies the payment
 * idempotently, then redirects back to the billing page. Dev/demo only.
 */
import { route } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { NextResponse } from 'next/server'
import { verifyMock } from '@/lib/billing/gateways'
import { applyPaidWebhook } from '@/lib/billing/subscriptions'
import { isProduction } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  if (isProduction) throw new ApiError('not_found', 'Not found')
  const url = new URL(req.url)
  const ref = url.searchParams.get('ref') ?? ''
  const sig = url.searchParams.get('sig') ?? ''
  if (!verifyMock(ref, sig)) throw new ApiError('forbidden', 'Invalid signature')

  await applyPaidWebhook('mock', ref, { simulated: true })
  return NextResponse.redirect(new URL('/billing?status=success', req.url))
})
