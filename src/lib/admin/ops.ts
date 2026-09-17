/**
 * Admin operations & business metrics (build prompt §9). Support staff can look
 * up users, fix entitlements, add notes, and re-run evaluations; the business
 * dashboard aggregates signups, conversion, AI spend and operational health.
 */
import { and, desc, eq, gte, ilike, or, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { users } from '../db/schema/identity'
import { subscriptions, payments, supportNotes } from '../db/schema/billing'
import { evaluations, attempts, writtenResponses } from '../db/schema/attempts'
import { enqueue, getQueue, QUEUE_NAMES } from '../queue/index'

export async function findUsers(q: string) {
  const like = `%${q}%`
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(or(ilike(users.email, like), ilike(users.name, like)))
    .limit(25)
}

export async function grantPlan(userId: string, planCode: 'free' | 'paid' | 'premium') {
  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
  if (existing) {
    await db
      .update(subscriptions)
      .set({ planCode, status: 'active', currentPeriodEnd: periodEnd, updatedAt: new Date() })
      .where(eq(subscriptions.id, existing.id))
  } else {
    await db
      .insert(subscriptions)
      .values({ userId, planCode, status: 'active', currentPeriodEnd: periodEnd })
  }
}

export async function addSupportNote(userId: string, authorId: string, note: string) {
  await db.insert(supportNotes).values({ userId, authorId, note })
}

export async function getUserDetail(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
  const notes = await db
    .select()
    .from(supportNotes)
    .where(eq(supportNotes.userId, userId))
    .orderBy(desc(supportNotes.createdAt))
    .limit(20)
  const userPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.createdAt))
    .limit(20)
  return { user, subscription: sub ?? null, notes, payments: userPayments }
}

/** Admin re-evaluation: enqueue evaluation for an attempt's responses (no quota). */
export async function reevaluateAttempt(attemptId: string): Promise<number> {
  const responses = await db
    .select({ id: writtenResponses.id, text: writtenResponses.responseText })
    .from(writtenResponses)
    .where(eq(writtenResponses.attemptId, attemptId))
  let n = 0
  for (const r of responses) {
    if (!(r.text ?? '').trim()) continue
    await enqueue(
      QUEUE_NAMES.evaluation,
      'evaluate',
      { writtenResponseId: r.id },
      { jobId: `eval_readmin_${r.id}_${Date.now()}` },
    )
    n++
  }
  return n
}

export async function businessMetrics() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [[signups], activeRows, subRows, [spend], [failedPay], [needsReview]] = await Promise.all([
    db.select({ n: sql<number>`count(*)`.mapWith(Number) }).from(users),
    db
      .select({ n: sql<number>`count(distinct ${attempts.userId})`.mapWith(Number) })
      .from(attempts)
      .where(gte(attempts.startedAt, since)),
    db
      .select({ plan: subscriptions.planCode, n: sql<number>`count(*)`.mapWith(Number) })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))
      .groupBy(subscriptions.planCode),
    db
      .select({ usd: sql<number>`coalesce(sum(${evaluations.costUsd}),0)`.mapWith(Number) })
      .from(evaluations),
    db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(payments)
      .where(eq(payments.status, 'failed')),
    db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(evaluations)
      .where(
        or(eq(evaluations.status, 'needs_review'), eq(evaluations.status, 'blocked_distress')),
      ),
  ])

  const activeUsers7d = activeRows[0]?.n ?? 0
  const totalSignups = signups?.n ?? 0
  const paidSubs = subRows.filter((r) => r.plan !== 'free').reduce((a, b) => a + b.n, 0)

  // Queue depth across background queues.
  const queueDepth: Record<string, number> = {}
  for (const name of Object.values(QUEUE_NAMES)) {
    try {
      const counts = await getQueue(name).getJobCounts('waiting', 'active', 'failed', 'delayed')
      queueDepth[name] = (counts.waiting ?? 0) + (counts.active ?? 0) + (counts.delayed ?? 0)
    } catch {
      queueDepth[name] = -1
    }
  }

  return {
    signups: totalSignups,
    activeUsers7d,
    subscriptionsByPlan: Object.fromEntries(subRows.map((r) => [r.plan, r.n])),
    conversionRate: totalSignups > 0 ? Number((paidSubs / totalSignups).toFixed(3)) : 0,
    aiSpendUsd: Number((spend?.usd ?? 0).toFixed(4)),
    failedPayments: failedPay?.n ?? 0,
    evaluationsNeedingReview: needsReview?.n ?? 0,
    queueDepth,
  }
}
