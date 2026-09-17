import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { users } from '../../src/lib/db/schema/identity'
import { subscriptions, payments, invoices } from '../../src/lib/db/schema/billing'
import { eq } from 'drizzle-orm'
import {
  createCheckout,
  applyPaidWebhook,
  refundPayment,
} from '../../src/lib/billing/subscriptions'
import { getUserPlan } from '../../src/lib/billing/quota'

let userId: string

describe('billing (integration, mock gateway)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'B', email: `b_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
  })
  afterAll(async () => {
    await db.delete(invoices).where(eq(invoices.userId, userId))
    await db.delete(payments).where(eq(payments.userId, userId))
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  it('checkout → paid webhook activates subscription and issues an invoice', async () => {
    expect(await getUserPlan(userId)).toBe('free')
    const { gatewayRef } = await createCheckout(userId, 'paid', 'mock')

    const applied = await applyPaidWebhook('mock', gatewayRef, { ok: true })
    expect(applied).toBe(true)
    expect(await getUserPlan(userId)).toBe('paid')

    const inv = await db.select().from(invoices).where(eq(invoices.userId, userId))
    expect(inv.length).toBe(1)
  })

  it('webhook is idempotent (re-delivery does not double-apply)', async () => {
    const { gatewayRef } = await createCheckout(userId, 'premium', 'mock')
    expect(await applyPaidWebhook('mock', gatewayRef, {})).toBe(true)
    expect(await applyPaidWebhook('mock', gatewayRef, {})).toBe(false)
    expect(await getUserPlan(userId)).toBe('premium')
  })

  it('refund downgrades the user to free', async () => {
    const { paymentId } = await createCheckout(userId, 'paid', 'mock')
    // Mark it paid first.
    const [p] = await db.select().from(payments).where(eq(payments.id, paymentId))
    await applyPaidWebhook('mock', p!.gatewayRef, {})
    await refundPayment(paymentId)
    expect(await getUserPlan(userId)).toBe('free')
  })
})
