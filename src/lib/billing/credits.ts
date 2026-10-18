/**
 * Credit ledger.
 *
 * A credit is one AI evaluation. Credits are the overflow on top of a plan's
 * daily allowance: when the day's quota is used up, a user with credits keeps
 * going and the credit is debited instead. That makes them strictly additive —
 * nobody gets less than their plan already gave them.
 *
 * Every movement writes a ledger row and updates the cached balance in the same
 * transaction, so `credit_accounts.balance` can never drift from its history.
 * `spendCredits` debits conditionally (`balance >= n` in the WHERE clause), so
 * two concurrent evaluations cannot overdraw the same account.
 */
import { and, desc, eq, gte, sql, type SQL } from 'drizzle-orm'
import { db } from '../db/index'
import { creditAccounts, creditLedger } from '../db/schema/admin'
import { users } from '../db/schema/identity'

export type CreditKind =
  'grant' | 'spend' | 'refund' | 'adjustment' | 'purchase' | 'plan_renewal' | 'expiry'

export type CreditMovement = {
  userId: string
  delta: number
  kind: CreditKind
  reason: string
  actorId?: string | null
  metadata?: Record<string, unknown>
}

export async function getBalance(userId: string): Promise<number> {
  const [row] = await db
    .select({ balance: creditAccounts.balance })
    .from(creditAccounts)
    .where(eq(creditAccounts.userId, userId))
    .limit(1)
  return row?.balance ?? 0
}

export async function getAccount(userId: string) {
  const [row] = await db
    .select()
    .from(creditAccounts)
    .where(eq(creditAccounts.userId, userId))
    .limit(1)
  return row ?? { userId, balance: 0, lifetimeGranted: 0, lifetimeSpent: 0, updatedAt: new Date() }
}

/**
 * Add credits (grant, purchase, refund, renewal) or apply a negative manual
 * adjustment. Returns the new balance. A negative adjustment may take the
 * balance to zero but never below it.
 */
export async function applyCredits(m: CreditMovement): Promise<number> {
  if (!Number.isInteger(m.delta) || m.delta === 0) {
    throw new Error('credit delta must be a non-zero integer')
  }
  return db.transaction(async (tx) => {
    const granted = m.delta > 0 ? m.delta : 0
    const spent = m.delta < 0 ? -m.delta : 0
    const [account] = await tx
      .insert(creditAccounts)
      .values({
        userId: m.userId,
        balance: Math.max(0, m.delta),
        lifetimeGranted: granted,
      })
      .onConflictDoUpdate({
        target: creditAccounts.userId,
        set: {
          // greatest(...) keeps a manual deduction from driving the balance negative.
          balance: sql`greatest(0, ${creditAccounts.balance} + ${m.delta})`,
          lifetimeGranted: sql`${creditAccounts.lifetimeGranted} + ${granted}`,
          lifetimeSpent: sql`${creditAccounts.lifetimeSpent} + least(${spent}, ${creditAccounts.balance})`,
          updatedAt: new Date(),
        },
      })
      .returning({ balance: creditAccounts.balance })

    const balanceAfter = account?.balance ?? 0
    await tx.insert(creditLedger).values({
      userId: m.userId,
      delta: m.delta,
      balanceAfter,
      kind: m.kind,
      reason: m.reason,
      actorId: m.actorId ?? null,
      metadata: m.metadata,
    })
    return balanceAfter
  })
}

/**
 * Debit `amount` credits if — and only if — the balance covers them.
 * Returns false when it does not, leaving the account untouched.
 */
export async function spendCredits(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, unknown>,
): Promise<boolean> {
  if (amount <= 0) return true
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(creditAccounts)
      .set({
        balance: sql`${creditAccounts.balance} - ${amount}`,
        lifetimeSpent: sql`${creditAccounts.lifetimeSpent} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(and(eq(creditAccounts.userId, userId), gte(creditAccounts.balance, amount)))
      .returning({ balance: creditAccounts.balance })

    if (!updated) return false
    await tx.insert(creditLedger).values({
      userId,
      delta: -amount,
      balanceAfter: updated.balance,
      kind: 'spend',
      reason,
      metadata,
    })
    return true
  })
}

export async function creditHistory(userId: string, limit = 50) {
  return db
    .select()
    .from(creditLedger)
    .where(eq(creditLedger.userId, userId))
    .orderBy(desc(creditLedger.createdAt))
    .limit(limit)
}

/** The platform-wide ledger, joined to the user it belongs to. */
export async function recentLedger(opts: { kind?: string; limit?: number; offset?: number } = {}) {
  const where: SQL[] = []
  if (opts.kind) where.push(eq(creditLedger.kind, opts.kind))
  const rows = await db
    .select({
      id: creditLedger.id,
      userId: creditLedger.userId,
      userName: users.name,
      userEmail: users.email,
      delta: creditLedger.delta,
      balanceAfter: creditLedger.balanceAfter,
      kind: creditLedger.kind,
      reason: creditLedger.reason,
      createdAt: creditLedger.createdAt,
    })
    .from(creditLedger)
    .innerJoin(users, eq(users.id, creditLedger.userId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(creditLedger.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0)
  return rows
}

/** Headline numbers for the credits screen. */
export async function creditStats() {
  const [[totals], [flow30], [holders]] = await Promise.all([
    db
      .select({
        outstanding: sql<number>`coalesce(sum(${creditAccounts.balance}),0)`.mapWith(Number),
        granted: sql<number>`coalesce(sum(${creditAccounts.lifetimeGranted}),0)`.mapWith(Number),
        spent: sql<number>`coalesce(sum(${creditAccounts.lifetimeSpent}),0)`.mapWith(Number),
      })
      .from(creditAccounts),
    db
      .select({
        issued:
          sql<number>`coalesce(sum(case when ${creditLedger.delta} > 0 then ${creditLedger.delta} else 0 end),0)`.mapWith(
            Number,
          ),
        consumed:
          sql<number>`coalesce(-sum(case when ${creditLedger.delta} < 0 then ${creditLedger.delta} else 0 end),0)`.mapWith(
            Number,
          ),
      })
      .from(creditLedger)
      .where(sql`${creditLedger.createdAt} >= now() - interval '30 days'`),
    db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(creditAccounts)
      .where(sql`${creditAccounts.balance} > 0`),
  ])

  return {
    outstanding: totals?.outstanding ?? 0,
    lifetimeGranted: totals?.granted ?? 0,
    lifetimeSpent: totals?.spent ?? 0,
    issued30d: flow30?.issued ?? 0,
    consumed30d: flow30?.consumed ?? 0,
    holders: holders?.n ?? 0,
  }
}

/** Top balances, for the credits table. */
export async function topBalances(limit = 25) {
  return db
    .select({
      userId: creditAccounts.userId,
      name: users.name,
      email: users.email,
      balance: creditAccounts.balance,
      lifetimeGranted: creditAccounts.lifetimeGranted,
      lifetimeSpent: creditAccounts.lifetimeSpent,
      updatedAt: creditAccounts.updatedAt,
    })
    .from(creditAccounts)
    .innerJoin(users, eq(users.id, creditAccounts.userId))
    .orderBy(desc(creditAccounts.balance))
    .limit(limit)
}
