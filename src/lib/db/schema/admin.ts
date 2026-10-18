/**
 * Admin / platform-operations tables.
 *
 * Three concerns live here, all of them admin-owned:
 *
 *  - **Credits** — a prepaid unit ledger. One credit buys one AI evaluation.
 *    `credit_accounts` is the running balance (fast to read on the hot path);
 *    `credit_ledger` is the immutable history behind it. The balance is always
 *    derivable from the ledger, so the account row is a cache that must only
 *    ever be written in the same transaction as its ledger entry.
 *
 *  - **Integrations** — third-party providers (AI, payments, messaging) whose
 *    credentials the operator sets from the admin panel instead of redeploying.
 *    Secrets are stored encrypted (see `src/lib/crypto/secrets.ts`); the plain
 *    value never leaves the server and is never returned by an API route.
 *
 *  - **API clients** — inbound keys issued to the mobile app and partners. Only
 *    a hash is stored, exactly as for passwords; the key itself is shown once
 *    at creation and cannot be recovered afterwards.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './identity'

export const creditAccounts = pgTable(
  'credit_accounts',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    balance: integer('balance').notNull().default(0),
    lifetimeGranted: integer('lifetime_granted').notNull().default(0),
    lifetimeSpent: integer('lifetime_spent').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('credit_accounts_balance_idx').on(t.balance)],
)

export const creditLedger = pgTable(
  'credit_ledger',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** Signed: positive tops up, negative spends. Never zero. */
    delta: integer('delta').notNull(),
    /** Balance after this entry — lets the history be read without re-summing. */
    balanceAfter: integer('balance_after').notNull(),
    // grant | spend | refund | adjustment | purchase | plan_renewal | expiry
    kind: text('kind').notNull(),
    reason: text('reason').notNull(),
    /** The admin who moved the credits, when a human did. */
    actorId: uuid('actor_id').references(() => users.id, { onDelete: 'set null' }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('credit_ledger_user_idx').on(t.userId, t.createdAt),
    index('credit_ledger_kind_idx').on(t.kind),
    index('credit_ledger_created_idx').on(t.createdAt),
  ],
)

export const integrations = pgTable(
  'integrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Registry key, e.g. 'anthropic' or 'jazzcash'. One row per provider. */
    slug: text('slug').notNull(),
    // ai | payments | messaging | storage | analytics
    category: text('category').notNull(),
    label: text('label').notNull(),
    enabled: boolean('enabled').notNull().default(false),
    /** AES-256-GCM envelope; `null` means "fall back to the environment". */
    credentials: text('credentials'),
    /** Non-secret settings (model id, base URL, merchant id, …). */
    config: jsonb('config').notNull().default({}),
    // unknown | ok | error
    status: text('status').notNull().default('unknown'),
    lastCheckedAt: timestamp('last_checked_at', { withTimezone: true }),
    lastLatencyMs: integer('last_latency_ms'),
    lastError: text('last_error'),
    updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('integrations_slug_key').on(t.slug),
    index('integrations_cat_idx').on(t.category),
  ],
)

export const apiClients = pgTable(
  'api_clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    /** Visible, non-secret half shown in lists: `issb_live_a1b2c3d4`. */
    keyPrefix: text('key_prefix').notNull(),
    /** SHA-256 of the full key. The key itself is never stored. */
    keyHash: text('key_hash').notNull(),
    scopes: jsonb('scopes').notNull().default([]),
    rateLimitPerMinute: integer('rate_limit_per_minute').notNull().default(60),
    // active | revoked
    status: text('status').notNull().default('active'),
    requestCount: integer('request_count').notNull().default(0),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    lastUsedIp: text('last_used_ip'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('api_clients_key_hash_key').on(t.keyHash),
    uniqueIndex('api_clients_prefix_key').on(t.keyPrefix),
    index('api_clients_status_idx').on(t.status),
  ],
)

export type CreditAccount = typeof creditAccounts.$inferSelect
export type CreditLedgerEntry = typeof creditLedger.$inferSelect
export type Integration = typeof integrations.$inferSelect
export type ApiClient = typeof apiClients.$inferSelect
