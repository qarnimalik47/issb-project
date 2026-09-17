/**
 * Identity & access tables: users, sessions, refresh tokens, OTP codes,
 * consent records, and the audit log.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
  date,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { userRole, locale, courseTrack, accountStatus, otpChannel, otpPurpose } from './enums'

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    phone: text('phone'),
    passwordHash: text('password_hash'),
    name: text('name').notNull(),
    role: userRole('role').notNull().default('student'),
    locale: locale('locale').notNull().default('en'),
    courseTrack: courseTrack('course_track'),
    targetIssbDate: date('target_issb_date'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    phoneVerifiedAt: timestamp('phone_verified_at', { withTimezone: true }),
    status: accountStatus('status').notNull().default('active'),
    failedLoginCount: integer('failed_login_count').notNull().default(0),
    lockedUntil: timestamp('locked_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('users_email_key').on(t.email),
    uniqueIndex('users_phone_key').on(t.phone),
    index('users_role_idx').on(t.role),
  ],
)

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    ip: text('ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('sessions_token_hash_key').on(t.tokenHash),
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_expires_at_idx').on(t.expiresAt),
  ],
)

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('refresh_tokens_token_hash_key').on(t.tokenHash),
    index('refresh_tokens_user_id_idx').on(t.userId),
  ],
)

export const otpCodes = pgTable(
  'otp_codes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    channel: otpChannel('channel').notNull(),
    purpose: otpPurpose('purpose').notNull(),
    codeHash: text('code_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    attempts: integer('attempts').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('otp_codes_user_purpose_idx').on(t.userId, t.purpose)],
)

export const consents = pgTable(
  'consents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    termsVersion: text('terms_version').notNull(),
    privacyVersion: text('privacy_version').notNull(),
    // { storeWritten: bool, storeVoice: bool, storeAssessment: bool }
    flags: jsonb('flags').notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }).notNull().defaultNow(),
    ip: text('ip'),
  },
  (t) => [index('consents_user_id_idx').on(t.userId)],
)

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetType: text('target_type'),
    targetId: text('target_id'),
    metadata: jsonb('metadata'),
    ip: text('ip'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('audit_logs_user_id_idx').on(t.userId),
    index('audit_logs_action_idx').on(t.action),
    index('audit_logs_created_at_idx').on(t.createdAt),
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
