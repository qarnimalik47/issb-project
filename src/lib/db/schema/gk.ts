/**
 * General Knowledge & Current Affairs tables (build prompt §4.5).
 * News is drafted (with original summaries) then human-approved before publish;
 * flashcards use SM-2 with per-user scheduling state.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './identity'
import { contentStatus } from './enums'

export const gkArticles = pgTable(
  'gk_articles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    headline: text('headline').notNull(),
    // Original, short summaries — never the source article text (rule §4.5).
    summaryEn: text('summary_en').notNull(),
    summaryUr: text('summary_ur'),
    category: text('category').notNull(), // pakistan | defence | international | economy | scitech | sports
    issbAngle: text('issb_angle'),
    oneLiner: text('one_liner'),
    sourceName: text('source_name'),
    sourceUrl: text('source_url'),
    publishedDate: date('published_date'),
    status: contentStatus('status').notNull().default('draft'),
    approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('gk_articles_status_idx').on(t.status),
    index('gk_articles_category_idx').on(t.category),
    index('gk_articles_date_idx').on(t.publishedDate),
  ],
)

export const flashcards = pgTable(
  'flashcards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deck: text('deck').notNull(),
    frontEn: text('front_en').notNull(),
    frontUr: text('front_ur'),
    backEn: text('back_en').notNull(),
    backUr: text('back_ur'),
    topic: text('topic'),
    status: contentStatus('status').notNull().default('published'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('flashcards_deck_idx').on(t.deck), index('flashcards_status_idx').on(t.status)],
)

export const flashcardState = pgTable(
  'flashcard_state',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    cardId: uuid('card_id')
      .notNull()
      .references(() => flashcards.id, { onDelete: 'cascade' }),
    repetitions: integer('repetitions').notNull().default(0),
    intervalDays: integer('interval_days').notNull().default(0),
    easiness: numeric('easiness').notNull().default('2.5'),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('flashcard_state_user_card_key').on(t.userId, t.cardId),
    index('flashcard_state_due_idx').on(t.userId, t.dueAt),
  ],
)

export const gkBookmarks = pgTable(
  'gk_bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    articleId: uuid('article_id')
      .notNull()
      .references(() => gkArticles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('gk_bookmarks_user_article_key').on(t.userId, t.articleId)],
)

export type GkArticle = typeof gkArticles.$inferSelect
export type Flashcard = typeof flashcards.$inferSelect
