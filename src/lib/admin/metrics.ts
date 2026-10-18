/**
 * Business metrics for the admin overview and the billing screen.
 *
 * Daily series are produced by `generate_series` left-joined to the data, so a
 * day with no signups comes back as a zero rather than a gap — a chart drawn
 * from sparse rows silently lies about the shape of a trend.
 *
 * Money is handled in minor units (cents/paisa) end to end; only the UI
 * divides. AI spend is the one figure denominated in USD, because that is the
 * currency the model providers bill in.
 */
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { users } from '../db/schema/identity'
import { invoices, payments, subscriptions } from '../db/schema/billing'
import { attempts, evaluations } from '../db/schema/attempts'
import { creditLedger } from '../db/schema/admin'
import { PLANS, type PlanCode } from '../billing/plans'

export type SeriesPoint = { date: string; value: number }

/**
 * A timestamp for interpolation into a raw `sql` fragment.
 *
 * Drizzle's comparison helpers know a column's type and encode a Date for it;
 * a Date dropped straight into a template literal has no such context and
 * postgres.js rejects it. An ISO string with an explicit cast is unambiguous.
 */
function ts(d: Date) {
  return sql`${d.toISOString()}::timestamptz`
}

/** A dense daily series: every day in the window, zero-filled. */
async function dailySeries(
  table: 'users' | 'payments' | 'attempts' | 'evaluations',
  days: number,
): Promise<SeriesPoint[]> {
  const spec = {
    users: sql`select date_trunc('day', created_at) d, count(*)::float v from users group by 1`,
    payments: sql`select date_trunc('day', created_at) d, sum(amount_cents)::float v from payments where status = 'paid' group by 1`,
    attempts: sql`select date_trunc('day', started_at) d, count(distinct user_id)::float v from attempts group by 1`,
    evaluations: sql`select date_trunc('day', created_at) d, coalesce(sum(cost_usd),0)::float v from evaluations group by 1`,
  }[table]

  const rows = await db.execute<{ day: string; value: number }>(sql`
    with span as (
      select generate_series(
        date_trunc('day', now()) - (${days - 1} || ' days')::interval,
        date_trunc('day', now()),
        '1 day'::interval
      ) as day
    ), src as (${spec})
    select to_char(span.day, 'YYYY-MM-DD') as day, coalesce(src.v, 0) as value
    from span left join src on src.d = span.day
    order by span.day
  `)

  return [...rows].map((r) => ({ date: r.day, value: Number(r.value) }))
}

export type DashboardMetrics = Awaited<ReturnType<typeof dashboardMetrics>>

/**
 * Everything the overview screen renders. One call, so the page has no
 * request waterfall and every tile describes the same instant.
 */
export async function dashboardMetrics(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const prevSince = new Date(Date.now() - 2 * days * 24 * 60 * 60 * 1000)
  const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    [totals],
    [window],
    [previous],
    planRows,
    [aiSpend],
    [aiSpendWindow],
    [failedPayments],
    [needsReview],
    signupSeries,
    revenueSeries,
    activeSeries,
    aiSeries,
  ] = await Promise.all([
    db
      .select({
        users: sql<number>`count(*)`.mapWith(Number),
        verified: sql<number>`count(*) filter (where ${users.emailVerifiedAt} is not null)`.mapWith(
          Number,
        ),
        suspended: sql<number>`count(*) filter (where ${users.status} <> 'active')`.mapWith(Number),
      })
      .from(users),
    db
      .select({
        signups: sql<number>`count(*) filter (where ${users.createdAt} >= ${ts(since)})`.mapWith(
          Number,
        ),
      })
      .from(users),
    db
      .select({
        signups:
          sql<number>`count(*) filter (where ${users.createdAt} >= ${ts(prevSince)} and ${users.createdAt} < ${ts(since)})`.mapWith(
            Number,
          ),
      })
      .from(users),
    db
      .select({ plan: subscriptions.planCode, n: sql<number>`count(*)`.mapWith(Number) })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))
      .groupBy(subscriptions.planCode),
    db
      .select({ usd: sql<number>`coalesce(sum(${evaluations.costUsd}),0)`.mapWith(Number) })
      .from(evaluations),
    db
      .select({ usd: sql<number>`coalesce(sum(${evaluations.costUsd}),0)`.mapWith(Number) })
      .from(evaluations)
      .where(gte(evaluations.createdAt, since)),
    db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(payments)
      .where(eq(payments.status, 'failed')),
    db
      .select({ n: sql<number>`count(*)`.mapWith(Number) })
      .from(evaluations)
      .where(sql`${evaluations.status} in ('needs_review','blocked_distress')`),
    dailySeries('users', days),
    dailySeries('payments', days),
    dailySeries('attempts', days),
    dailySeries('evaluations', days),
  ])

  const [activeUsers7d] = await db
    .select({ n: sql<number>`count(distinct ${attempts.userId})`.mapWith(Number) })
    .from(attempts)
    .where(gte(attempts.startedAt, week))

  const subscriptionsByPlan = Object.fromEntries(planRows.map((r) => [r.plan, r.n]))
  const totalUsers = totals?.users ?? 0
  const paidSubs = planRows.filter((r) => r.plan !== 'free').reduce((a, b) => a + b.n, 0)

  const revenueWindow = revenueSeries.reduce((a, p) => a + p.value, 0)
  const halfway = Math.floor(revenueSeries.length / 2)
  const revenueFirstHalf = revenueSeries.slice(0, halfway).reduce((a, p) => a + p.value, 0)
  const revenueSecondHalf = revenueSeries.slice(halfway).reduce((a, p) => a + p.value, 0)

  // Monthly recurring revenue from list prices, not historic receipts: what the
  // current book of active subscriptions is worth for a further month.
  const mrrCents = planRows.reduce(
    (sum, r) => sum + (PLANS[r.plan as PlanCode]?.priceCents ?? 0) * r.n,
    0,
  )

  return {
    windowDays: days,
    users: {
      total: totalUsers,
      verified: totals?.verified ?? 0,
      suspended: totals?.suspended ?? 0,
      signupsInWindow: window?.signups ?? 0,
      signupsPreviousWindow: previous?.signups ?? 0,
      activeUsers7d: activeUsers7d?.n ?? 0,
    },
    revenue: {
      windowCents: Math.round(revenueWindow),
      mrrCents,
      firstHalfCents: Math.round(revenueFirstHalf),
      secondHalfCents: Math.round(revenueSecondHalf),
      arpuCents: paidSubs > 0 ? Math.round(mrrCents / paidSubs) : 0,
      failedPayments: failedPayments?.n ?? 0,
    },
    subscriptionsByPlan,
    conversionRate: totalUsers > 0 ? Number((paidSubs / totalUsers).toFixed(4)) : 0,
    ai: {
      lifetimeUsd: Number((aiSpend?.usd ?? 0).toFixed(4)),
      windowUsd: Number((aiSpendWindow?.usd ?? 0).toFixed(4)),
      needsReview: needsReview?.n ?? 0,
    },
    series: {
      signups: signupSeries,
      revenueCents: revenueSeries,
      activeUsers: activeSeries,
      aiSpendUsd: aiSeries,
    },
  }
}

/** The billing screen: receipts, refunds and the state of the subscription book. */
export async function billingOverview(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const [byStatus, byGateway, planRows, recentPayments, recentInvoices, [creditRevenue]] =
    await Promise.all([
      db
        .select({
          status: payments.status,
          n: sql<number>`count(*)`.mapWith(Number),
          cents: sql<number>`coalesce(sum(${payments.amountCents}),0)`.mapWith(Number),
        })
        .from(payments)
        .groupBy(payments.status),
      db
        .select({
          gateway: payments.gateway,
          n: sql<number>`count(*)`.mapWith(Number),
          paidCents:
            sql<number>`coalesce(sum(${payments.amountCents}) filter (where ${payments.status} = 'paid'),0)`.mapWith(
              Number,
            ),
          failures: sql<number>`count(*) filter (where ${payments.status} = 'failed')`.mapWith(
            Number,
          ),
        })
        .from(payments)
        .where(gte(payments.createdAt, since))
        .groupBy(payments.gateway),
      db
        .select({
          plan: subscriptions.planCode,
          status: subscriptions.status,
          n: sql<number>`count(*)`.mapWith(Number),
        })
        .from(subscriptions)
        .groupBy(subscriptions.planCode, subscriptions.status),
      db
        .select({
          id: payments.id,
          userId: payments.userId,
          userName: users.name,
          userEmail: users.email,
          gateway: payments.gateway,
          planCode: payments.planCode,
          amountCents: payments.amountCents,
          currency: payments.currency,
          status: payments.status,
          gatewayRef: payments.gatewayRef,
          createdAt: payments.createdAt,
          paidAt: payments.paidAt,
        })
        .from(payments)
        .innerJoin(users, eq(users.id, payments.userId))
        .orderBy(desc(payments.createdAt))
        .limit(50),
      db
        .select({
          id: invoices.id,
          number: invoices.number,
          userName: users.name,
          userEmail: users.email,
          planCode: invoices.planCode,
          amountCents: invoices.amountCents,
          currency: invoices.currency,
          issuedAt: invoices.issuedAt,
        })
        .from(invoices)
        .innerJoin(users, eq(users.id, invoices.userId))
        .orderBy(desc(invoices.issuedAt))
        .limit(25),
      db
        .select({
          credits: sql<number>`coalesce(sum(${creditLedger.delta}),0)`.mapWith(Number),
        })
        .from(creditLedger)
        .where(and(eq(creditLedger.kind, 'purchase'), gte(creditLedger.createdAt, since))),
    ])

  const paid = byStatus.find((r) => r.status === 'paid')
  const refunded = byStatus.find((r) => r.status === 'refunded')
  const failed = byStatus.find((r) => r.status === 'failed')
  const pending = byStatus.find((r) => r.status === 'pending')
  const attempted = (paid?.n ?? 0) + (failed?.n ?? 0)

  return {
    windowDays: days,
    totals: {
      grossCents: paid?.cents ?? 0,
      refundedCents: refunded?.cents ?? 0,
      netCents: (paid?.cents ?? 0) - (refunded?.cents ?? 0),
      paidCount: paid?.n ?? 0,
      refundedCount: refunded?.n ?? 0,
      failedCount: failed?.n ?? 0,
      pendingCount: pending?.n ?? 0,
      successRate: attempted > 0 ? Number(((paid?.n ?? 0) / attempted).toFixed(4)) : 0,
      creditsPurchased: creditRevenue?.credits ?? 0,
    },
    byGateway,
    subscriptionBook: planRows,
    plans: Object.entries(PLANS).map(([code, p]) => ({
      code,
      nameEn: p.nameEn,
      priceCents: p.priceCents,
      currency: p.currency,
      entitlements: p.entitlements,
      activeCount: planRows
        .filter((r) => r.plan === code && r.status === 'active')
        .reduce((a, b) => a + b.n, 0),
    })),
    payments: recentPayments,
    invoices: recentInvoices,
    revenueSeriesCents: await dailySeries('payments', days),
  }
}
