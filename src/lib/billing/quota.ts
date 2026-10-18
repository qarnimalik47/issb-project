/**
 * Server-side quota enforcement (rule 4.7 / 1.3: quota enforced at the API
 * layer BEFORE any AI call). Reads the user's plan entitlements and the day's
 * usage counter; blocks when over the cap.
 */
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { subscriptions } from '../db/schema/billing'
import { usageCounters } from '../db/schema/billing'
import { ApiError } from '../api/errors'
import { spendCredits } from './credits'
import { entitlementsFor, type Entitlements, type PlanCode } from './plans'

export async function getUserPlan(userId: string): Promise<PlanCode> {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active'),
        or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, new Date())),
      ),
    )
    .limit(1)
  const code = sub?.planCode
  if (code === 'paid' || code === 'premium') return code
  return 'free'
}

export async function getEntitlements(userId: string): Promise<Entitlements> {
  return entitlementsFor(await getUserPlan(userId))
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

async function currentCount(userId: string, metric: string, periodKey: string): Promise<number> {
  const [row] = await db
    .select({ count: usageCounters.count })
    .from(usageCounters)
    .where(
      and(
        eq(usageCounters.userId, userId),
        eq(usageCounters.metric, metric),
        eq(usageCounters.periodKey, periodKey),
      ),
    )
    .limit(1)
  return row?.count ?? 0
}

/** Throw quota_exceeded if the user has no remaining allowance for `metric`. */
export async function assertQuota(userId: string, metric: 'ai_evaluation'): Promise<void> {
  const ent = await getEntitlements(userId)
  const cap = metric === 'ai_evaluation' ? ent.aiEvaluationsPerDay : 0
  const used = await currentCount(userId, metric, dayKey())
  if (used >= cap) {
    throw new ApiError(
      'quota_exceeded',
      'You have reached your evaluation limit for today. Upgrade your plan for more.',
    )
  }
}

/** Atomically increment the day's usage counter. */
export async function consumeQuota(userId: string, metric: 'ai_evaluation'): Promise<void> {
  const periodKey = dayKey()
  await db
    .insert(usageCounters)
    .values({ userId, metric, periodKey, count: 1 })
    .onConflictDoUpdate({
      target: [usageCounters.userId, usageCounters.metric, usageCounters.periodKey],
      set: { count: sql`${usageCounters.count} + 1`, updatedAt: new Date() },
    })
}

/**
 * Claim one AI evaluation for a user, preferring the plan's daily allowance and
 * falling back to their credit balance once that is used up. Returns which
 * bucket paid for it so the caller can report it; throws `quota_exceeded` when
 * neither can.
 *
 * This is the path real evaluations take. `assertQuota`/`consumeQuota` remain
 * the plain plan-only primitives underneath it.
 */
export async function reserveEvaluation(userId: string): Promise<'plan' | 'credit'> {
  const ent = await getEntitlements(userId)
  const used = await currentCount(userId, 'ai_evaluation', dayKey())
  if (used < ent.aiEvaluationsPerDay) {
    await consumeQuota(userId, 'ai_evaluation')
    return 'plan'
  }
  if (await spendCredits(userId, 1, 'AI evaluation (daily allowance used)')) return 'credit'
  throw new ApiError(
    'quota_exceeded',
    'You have reached your evaluation limit for today. Upgrade your plan or top up credits for more.',
  )
}
