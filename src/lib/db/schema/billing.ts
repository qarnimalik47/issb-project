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

export type Plan = typeof plans.$inferSelect
export type Subscription = typeof subscriptions.$inferSelect
