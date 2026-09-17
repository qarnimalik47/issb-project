/**
 * Billing & entitlements tables. Introduced in Phase 5 for quota enforcement;
 * extended in Phase 9 (payments, invoices, refunds, expert reviews).
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './identity'

export const plans = pgTable('plans', {
  code: text('code').primaryKey(), // 'free' | 'paid' | 'premium'
  nameEn: text('name_en').notNull(),
  nameUr: text('name_ur').notNull(),
  priceCents: integer('price_cents').notNull().default(0),
  currency: text('currency').notNull().default('PKR'),
  // entitlements: { aiEvaluationsPerDay, mockInterviewsPerMonth, expertReviewsPerMonth, unlimitedMcq }
  entitlements: jsonb('entitlements').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    planCode: text('plan_code')
      .notNull()
      .references(() => plans.code, { onDelete: 'restrict' }),
    status: text('status').notNull().default('active'), // active | past_due | canceled | expired
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    graceUntil: timestamp('grace_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('subscriptions_user_idx').on(t.userId),
    index('subscriptions_status_idx').on(t.status),
  ],
)

export const usageCounters = pgTable(
  'usage_counters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    metric: text('metric').notNull(), // 'ai_evaluation' | 'mock_interview' | ...
    periodKey: text('period_key').notNull(), // e.g. '2026-09-18' (day) or '2026-09' (month)
    count: integer('count').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('usage_counters_key').on(t.userId, t.metric, t.periodKey)],
)

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    gateway: text('gateway').notNull(), // mock | jazzcash | easypaisa | card
    planCode: text('plan_code').notNull(),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('PKR'),
    status: text('status').notNull().default('pending'), // pending | paid | failed | refunded
    // Gateway transaction reference — unique for webhook idempotency.
    gatewayRef: text('gateway_ref').notNull(),
    rawPayload: jsonb('raw_payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('payments_gateway_ref_key').on(t.gateway, t.gatewayRef),
    index('payments_user_idx').on(t.userId),
    index('payments_status_idx').on(t.status),
  ],
)

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    number: text('number').notNull(),
    planCode: text('plan_code').notNull(),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('PKR'),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('invoices_number_key').on(t.number), index('invoices_user_idx').on(t.userId)],
)

export const expertReviews = pgTable(
  'expert_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    subjectType: text('subject_type').notNull(), // 'attempt' | 'written_response'
    subjectId: uuid('subject_id').notNull(),
    status: text('status').notNull().default('queued'), // queued | assigned | completed
    reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
    reviewerFeedback: text('reviewer_feedback'),
    // Reviewer's quality rating of the response (feeds a future training set).
    reviewerRating: integer('reviewer_rating'),
    requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [
    index('expert_reviews_status_idx').on(t.status),
    index('expert_reviews_user_idx').on(t.userId),
  ],
)

export const supportNotes = pgTable(
  'support_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id').references(() => users.id, { onDelete: 'set null' }),
    note: text('note').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('support_notes_user_idx').on(t.userId)],
)

export type Plan = typeof plans.$inferSelect
export type Subscription = typeof subscriptions.$inferSelect
export type Payment = typeof payments.$inferSelect
