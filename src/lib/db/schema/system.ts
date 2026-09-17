/**
 * System-level tables (not part of the user-facing domain).
 */
import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const appMetadata = pgTable('app_metadata', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type AppMetadataRow = typeof appMetadata.$inferSelect
export type NewAppMetadataRow = typeof appMetadata.$inferInsert
