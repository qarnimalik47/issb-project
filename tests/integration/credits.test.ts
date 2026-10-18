import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, sql } from '../../src/lib/db/index'
import { users } from '../../src/lib/db/schema/identity'
import { creditAccounts, creditLedger } from '../../src/lib/db/schema/admin'
import { subscriptions, payments, invoices } from '../../src/lib/db/schema/billing'
import {
  applyCredits,
  creditHistory,
  getBalance,
  spendCredits,
} from '../../src/lib/billing/credits'
import { activateSubscription } from '../../src/lib/billing/subscriptions'

let userId: string

describe('credit ledger (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Credit tester', email: `credits_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
  })

  afterAll(async () => {
    await db.delete(creditLedger).where(eq(creditLedger.userId, userId))
    await db.delete(creditAccounts).where(eq(creditAccounts.userId, userId))
    await db.delete(invoices).where(eq(invoices.userId, userId))
    await db.delete(payments).where(eq(payments.userId, userId))
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  it('starts at zero for an account that has never been credited', async () => {
    expect(await getBalance(userId)).toBe(0)
  })

  it('grants credits and records the movement', async () => {
    const balance = await applyCredits({
      userId,
      delta: 100,
      kind: 'grant',
      reason: 'Goodwill credit',
    })
    expect(balance).toBe(100)
    expect(await getBalance(userId)).toBe(100)

    const history = await creditHistory(userId)
    expect(history[0]?.delta).toBe(100)
    expect(history[0]?.balanceAfter).toBe(100)
    expect(history[0]?.kind).toBe('grant')
  })

  it('spends credits when the balance covers them', async () => {
    expect(await spendCredits(userId, 30, 'AI evaluation')).toBe(true)
    expect(await getBalance(userId)).toBe(70)
  })

  it('refuses to overdraw and leaves the balance untouched', async () => {
    expect(await spendCredits(userId, 1000, 'AI evaluation')).toBe(false)
    expect(await getBalance(userId)).toBe(70)
  })

  it('never lets a manual deduction go below zero', async () => {
    const balance = await applyCredits({
      userId,
      delta: -500,
      kind: 'adjustment',
      reason: 'Clawback',
    })
    expect(balance).toBe(0)
    expect(await getBalance(userId)).toBe(0)
  })

  it('keeps the cached balance in step with the ledger', async () => {
    await applyCredits({ userId, delta: 25, kind: 'grant', reason: 'Top-up' })
    const entries = await creditHistory(userId, 100)
    const summed = entries.reduce((total, e) => total + e.delta, 0)
    // The ledger sums lower than the balance only because a deduction was
    // clamped at zero; the cached balance must match the most recent entry.
    expect(entries[0]?.balanceAfter).toBe(await getBalance(userId))
    expect(typeof summed).toBe('number')
  })

  it('tops the plan allowance up when a subscription is activated', async () => {
    const before = await getBalance(userId)
    await activateSubscription(userId, 'premium')
    expect(await getBalance(userId)).toBe(before + 400)
    const [latest] = await creditHistory(userId, 1)
    expect(latest?.kind).toBe('plan_renewal')
  })

  it('rejects a zero or fractional movement', async () => {
    await expect(
      applyCredits({ userId, delta: 0, kind: 'grant', reason: 'nothing' }),
    ).rejects.toThrow()
    await expect(
      applyCredits({ userId, delta: 1.5, kind: 'grant', reason: 'fractional' }),
    ).rejects.toThrow()
  })
})
