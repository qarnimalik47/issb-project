/**
 * Subscription lifecycle: checkout, payment application (idempotent), invoices,
 * upgrades/downgrades, refunds, and expiry with a grace period.
 */
import { and, eq, lt, isNotNull } from 'drizzle-orm'
import { db } from '../db/index'
import { payments, invoices, subscriptions } from '../db/schema/billing'
import { PLANS, type PlanCode } from './plans'
import { generateGatewayRef, type Gateway } from './gateways'
import { childLogger } from '../logger/index'

const log = childLogger('billing')
const PERIOD_DAYS = 30
const GRACE_DAYS = 3

export async function createCheckout(
  userId: string,
  planCode: PlanCode,
  gateway: Gateway,
): Promise<{ paymentId: string; gatewayRef: string; amountCents: number }> {
  const plan = PLANS[planCode]
  const gatewayRef = generateGatewayRef()
  const [payment] = await db
    .insert(payments)
    .values({
      userId,
      gateway,
      planCode,
      amountCents: plan.priceCents,
      currency: plan.currency,
      status: 'pending',
      gatewayRef,
    })
    .returning({ id: payments.id })
  return { paymentId: payment!.id, gatewayRef, amountCents: plan.priceCents }
}

/**
 * Apply a successful payment: idempotent by (gateway, gatewayRef). Marks the
 * payment paid, activates/upgrades the subscription, and issues an invoice.
 * Returns false if the payment was already applied.
 */
export async function applyPaidWebhook(
  gateway: Gateway,
  gatewayRef: string,
  rawPayload: unknown,
): Promise<boolean> {
  const [payment] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.gateway, gateway), eq(payments.gatewayRef, gatewayRef)))
    .limit(1)
  if (!payment) throw new Error('payment not found for webhook')
  if (payment.status === 'paid' || payment.status === 'refunded') {
    return false // idempotent: already processed
  }

  await db
    .update(payments)
    .set({ status: 'paid', paidAt: new Date(), rawPayload: rawPayload as object })
    .where(eq(payments.id, payment.id))

  await activateSubscription(payment.userId, payment.planCode as PlanCode)

  const number = `INV-${new Date().getFullYear()}-${payment.id.slice(0, 8).toUpperCase()}`
  await db.insert(invoices).values({
    userId: payment.userId,
    paymentId: payment.id,
    number,
    planCode: payment.planCode,
    amountCents: payment.amountCents,
    currency: payment.currency,
  })

  log.info(
    { userId: payment.userId, plan: payment.planCode },
    'payment applied, subscription active',
  )
  return true
}

/** Activate or upgrade/downgrade a user's subscription to a plan. */
export async function activateSubscription(userId: string, planCode: PlanCode): Promise<void> {
  const periodEnd = new Date(Date.now() + PERIOD_DAYS * 24 * 60 * 60 * 1000)
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
  if (existing) {
    await db
      .update(subscriptions)
      .set({
        planCode,
        status: 'active',
        currentPeriodEnd: periodEnd,
        graceUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing.id))
  } else {
    await db
      .insert(subscriptions)
      .values({ userId, planCode, status: 'active', currentPeriodEnd: periodEnd })
  }
}

export async function refundPayment(paymentId: string): Promise<void> {
  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
  if (!payment) throw new Error('payment not found')
  await db.update(payments).set({ status: 'refunded' }).where(eq(payments.id, paymentId))
  // Downgrade the user to free.
  await db
    .update(subscriptions)
    .set({ planCode: 'free', status: 'canceled', updatedAt: new Date() })
    .where(eq(subscriptions.userId, payment.userId))
}

/**
 * Expire subscriptions whose period ended: enter grace first, then downgrade to
 * free. Run on a schedule (scripts/expire-subscriptions.ts).
 */
export async function expireDueSubscriptions(): Promise<{ graced: number; expired: number }> {
  const now = new Date()
  // Move active-but-past-period into grace.
  const graceUntil = new Date(now.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000)
  const toGrace = await db
    .update(subscriptions)
    .set({ status: 'past_due', graceUntil, updatedAt: now })
    .where(
      and(
        eq(subscriptions.status, 'active'),
        isNotNull(subscriptions.currentPeriodEnd),
        lt(subscriptions.currentPeriodEnd, now),
      ),
    )
    .returning({ id: subscriptions.id })

  // Downgrade past_due whose grace elapsed.
  const toExpire = await db
    .update(subscriptions)
    .set({ status: 'expired', planCode: 'free', updatedAt: now })
    .where(
      and(
        eq(subscriptions.status, 'past_due'),
        isNotNull(subscriptions.graceUntil),
        lt(subscriptions.graceUntil, now),
      ),
    )
    .returning({ id: subscriptions.id })

  return { graced: toGrace.length, expired: toExpire.length }
}
