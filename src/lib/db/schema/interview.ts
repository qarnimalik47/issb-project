/**
 * PIQ (Personal Information Questionnaire) storage. The mock interview is
 * generated from the user's own PIQ (build prompt §7 / §4.3).
 */
import { pgTable, uuid, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { users } from './identity'

export const piqProfiles = pgTable(
  'piq_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    data: jsonb('data').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('piq_profiles_user_key').on(t.userId)],
)

export type PiqProfile = typeof piqProfiles.$inferSelect
