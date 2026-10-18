/**
 * User administration: the searchable roster behind the Users screen, plus the
 * actions support staff take on an individual account.
 *
 * The roster is one query with left joins rather than a fan-out per row — an
 * admin filtering 5,000 accounts should not cost 5,000 round trips. Everything
 * the table shows (plan, account status, credit balance, last activity, spend)
 * comes back in that single statement.
 */
import { and, asc, count, desc, eq, gte, ilike, inArray, or, sql, type SQL } from 'drizzle-orm'
import { db } from '../db/index'
import { sessions, users } from '../db/schema/identity'
import { subscriptions, payments, supportNotes } from '../db/schema/billing'
import { attempts, evaluations } from '../db/schema/attempts'
import { creditAccounts } from '../db/schema/admin'
import { creditHistory } from '../billing/credits'

export type UserStatus = 'active' | 'locked' | 'deleted'
export type UserRole = 'student' | 'content_editor' | 'expert_reviewer' | 'admin'

export type UserListFilters = {
  q?: string
  role?: UserRole
  status?: UserStatus
  plan?: string
  /** 'active_7d' | 'dormant_30d' | 'never' */
  activity?: string
  sort?: 'recent' | 'name' | 'spend' | 'activity'
  page?: number
  pageSize?: number
}

export type UserRow = {
  id: string
  name: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  planCode: string
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  credits: number
  attempts: number
  lastActiveAt: string | null
  spendCents: number
  createdAt: string
}

const SORTS = {
  recent: desc(users.createdAt),
  name: asc(users.name),
  spend: desc(sql`coalesce(paid.total, 0)`),
  activity: desc(sql`activity.last_active`),
} as const

/**
 * One page of the roster. `q` matches name, email or phone; the remaining
 * filters narrow by role, account status, plan and recency of activity.
 */
export async function listUsers(filters: UserListFilters = {}) {
  const page = Math.max(1, filters.page ?? 1)
  const pageSize = Math.min(100, Math.max(5, filters.pageSize ?? 25))

  // Per-user aggregates, computed once as subqueries and joined in.
  const paid = db
    .select({
      userId: payments.userId,
      total: sql<number>`sum(${payments.amountCents})`.as('total'),
    })
    .from(payments)
    .where(eq(payments.status, 'paid'))
    .groupBy(payments.userId)
    .as('paid')

  const activity = db
    .select({
      userId: attempts.userId,
      lastActive: sql<Date>`max(${attempts.startedAt})`.as('last_active'),
      attemptCount: sql<number>`count(*)`.as('attempt_count'),
    })
    .from(attempts)
    .groupBy(attempts.userId)
    .as('activity')

  const where: SQL[] = []
  if (filters.q) {
    const like = `%${filters.q}%`
    const match = or(ilike(users.email, like), ilike(users.name, like), ilike(users.phone, like))
    if (match) where.push(match)
  }
  if (filters.role) where.push(eq(users.role, filters.role))
  if (filters.status) where.push(eq(users.status, filters.status))
  if (filters.plan) {
    where.push(
      filters.plan === 'free'
        ? sql`coalesce(${subscriptions.planCode}, 'free') = 'free'`
        : eq(subscriptions.planCode, filters.plan),
    )
  }
  if (filters.activity === 'active_7d') {
    where.push(sql`activity.last_active >= now() - interval '7 days'`)
  } else if (filters.activity === 'dormant_30d') {
    where.push(
      sql`(activity.last_active is null or activity.last_active < now() - interval '30 days')`,
    )
  } else if (filters.activity === 'never') {
    where.push(sql`activity.last_active is null`)
  }
  const predicate = where.length ? and(...where) : undefined

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      status: users.status,
      emailVerifiedAt: users.emailVerifiedAt,
      createdAt: users.createdAt,
      planCode: sql<string>`coalesce(${subscriptions.planCode}, 'free')`,
      subscriptionStatus: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      credits: sql<number>`coalesce(${creditAccounts.balance}, 0)`.mapWith(Number),
      attempts: sql<number>`coalesce(activity.attempt_count, 0)`.mapWith(Number),
      lastActiveAt: sql<Date | null>`activity.last_active`,
      spendCents: sql<number>`coalesce(paid.total, 0)`.mapWith(Number),
    })
    .from(users)
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .leftJoin(creditAccounts, eq(creditAccounts.userId, users.id))
    .leftJoin(paid, eq(paid.userId, users.id))
    .leftJoin(activity, eq(activity.userId, users.id))
    .where(predicate)
    .orderBy(SORTS[filters.sort ?? 'recent'])
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const [totalRow] = await db
    .select({ n: count() })
    .from(users)
    .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
    .leftJoin(activity, eq(activity.userId, users.id))
    .where(predicate)

  const list: UserRow[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    role: r.role as UserRole,
    status: r.status as UserStatus,
    emailVerified: Boolean(r.emailVerifiedAt),
    planCode: r.planCode,
    subscriptionStatus: r.subscriptionStatus,
    currentPeriodEnd: r.currentPeriodEnd ? new Date(r.currentPeriodEnd).toISOString() : null,
    credits: r.credits,
    attempts: r.attempts,
    lastActiveAt: r.lastActiveAt ? new Date(r.lastActiveAt).toISOString() : null,
    spendCents: r.spendCents,
    createdAt: new Date(r.createdAt).toISOString(),
  }))

  return { users: list, page, pageSize, total: totalRow?.n ?? 0 }
}

/** Counts for the chips above the roster. */
export async function userSummary() {
  const [byStatus, byRole, [verified], [newThisWeek]] = await Promise.all([
    db.select({ status: users.status, n: count() }).from(users).groupBy(users.status),
    db.select({ role: users.role, n: count() }).from(users).groupBy(users.role),
    db
      .select({ n: count() })
      .from(users)
      .where(sql`${users.emailVerifiedAt} is not null`),
    db
      .select({ n: count() })
      .from(users)
      .where(gte(users.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))),
  ])
  return {
    byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.n])),
    byRole: Object.fromEntries(byRole.map((r) => [r.role, r.n])),
    verified: verified?.n ?? 0,
    newThisWeek: newThisWeek?.n ?? 0,
  }
}

/**
 * Suspend or restore an account. Suspending also revokes live sessions, so the
 * user is signed out rather than kept going until their cookie expires.
 */
export async function setUserStatus(userId: string, status: UserStatus): Promise<void> {
  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, userId))
  if (status !== 'active') await revokeSessions(userId)
}

export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId))
}

export async function revokeSessions(userId: string): Promise<number> {
  const revoked = await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(and(eq(sessions.userId, userId), sql`${sessions.revokedAt} is null`))
    .returning({ id: sessions.id })
  return revoked.length
}

/** Clear a lockout from failed sign-ins without touching the password. */
export async function unlockUser(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ failedLoginCount: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(users.id, userId))
}

/** Everything the detail drawer shows for one account. */
export async function userProfile(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user) return null

  const [subscription, notes, userPayments, credits, ledger, [activity], [spend], liveSessions] =
    await Promise.all([
      db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId))
        .limit(1)
        .then((r) => r[0] ?? null),
      db
        .select({
          id: supportNotes.id,
          note: supportNotes.note,
          createdAt: supportNotes.createdAt,
          authorName: users.name,
        })
        .from(supportNotes)
        .leftJoin(users, eq(users.id, supportNotes.authorId))
        .where(eq(supportNotes.userId, userId))
        .orderBy(desc(supportNotes.createdAt))
        .limit(25),
      db
        .select()
        .from(payments)
        .where(eq(payments.userId, userId))
        .orderBy(desc(payments.createdAt))
        .limit(25),
      db
        .select()
        .from(creditAccounts)
        .where(eq(creditAccounts.userId, userId))
        .limit(1)
        .then((r) => r[0] ?? null),
      creditHistory(userId, 25),
      db
        .select({
          attempts: sql<number>`count(*)`.mapWith(Number),
          lastActive: sql<Date | null>`max(${attempts.startedAt})`,
        })
        .from(attempts)
        .where(eq(attempts.userId, userId)),
      db
        .select({
          evaluations: sql<number>`count(*)`.mapWith(Number),
          aiCostUsd: sql<number>`coalesce(sum(${evaluations.costUsd}),0)`.mapWith(Number),
        })
        .from(evaluations)
        .where(eq(evaluations.userId, userId)),
      db
        .select({
          id: sessions.id,
          ip: sessions.ip,
          userAgent: sessions.userAgent,
          createdAt: sessions.createdAt,
          expiresAt: sessions.expiresAt,
        })
        .from(sessions)
        .where(and(eq(sessions.userId, userId), sql`${sessions.revokedAt} is null`))
        .orderBy(desc(sessions.createdAt))
        .limit(10),
    ])

  const lifetimeSpend = userPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amountCents, 0)

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      locale: user.locale,
      courseTrack: user.courseTrack,
      targetIssbDate: user.targetIssbDate,
      emailVerifiedAt: user.emailVerifiedAt,
      phoneVerifiedAt: user.phoneVerifiedAt,
      lockedUntil: user.lockedUntil,
      failedLoginCount: user.failedLoginCount,
      createdAt: user.createdAt,
    },
    subscription,
    notes,
    payments: userPayments,
    credits: credits ?? { balance: 0, lifetimeGranted: 0, lifetimeSpent: 0 },
    ledger,
    sessions: liveSessions,
    stats: {
      attempts: activity?.attempts ?? 0,
      lastActiveAt: activity?.lastActive ?? null,
      evaluations: spend?.evaluations ?? 0,
      aiCostUsd: Number((spend?.aiCostUsd ?? 0).toFixed(4)),
      lifetimeSpendCents: lifetimeSpend,
    },
  }
}

/** Resolve email addresses to ids for a bulk credit grant. */
export async function resolveUserIds(emails: string[]): Promise<{ id: string; email: string }[]> {
  if (emails.length === 0) return []
  return db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(inArray(users.email, emails))
}

/** All user ids on a plan — the audience for a plan-wide credit grant. */
export async function userIdsOnPlan(planCode: string): Promise<string[]> {
  if (planCode === 'free') {
    const rows = await db
      .select({ id: users.id })
      .from(users)
      .leftJoin(subscriptions, eq(subscriptions.userId, users.id))
      .where(sql`coalesce(${subscriptions.planCode}, 'free') = 'free'`)
    return rows.map((r) => r.id)
  }
  const rows = await db
    .select({ id: subscriptions.userId })
    .from(subscriptions)
    .where(and(eq(subscriptions.planCode, planCode), eq(subscriptions.status, 'active')))
  return rows.map((r) => r.id)
}
