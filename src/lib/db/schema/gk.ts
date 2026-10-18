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
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { users } from './identity'
import { contentStatus, gkTopicKind } from './enums'

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
    /** Cards generated from a topic are replaced wholesale when it is
        re-gathered, so they carry the topic they came from. */
    topicId: uuid('topic_id').references((): AnyPgColumn => gkTopics.id, { onDelete: 'cascade' }),
    status: contentStatus('status').notNull().default('published'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('flashcards_deck_idx').on(t.deck),
    index('flashcards_status_idx').on(t.status),
    index('flashcards_topic_idx').on(t.topicId),
  ],
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

/** A single sourced fact: "Date of birth — 25 December 1876". */
export type GkFact = { label: string; value: string; sourceIndex?: number }

/** A headed group of bullet points, e.g. "Origin" or "Role in the movement". */
export type GkPointGroup = { heading: string; bullets: string[] }

export type GkTimelineEntry = { date: string; event: string }

/** Provenance is shown to candidates, so the licence travels with the link. */
export type GkSource = {
  name: string
  url: string
  license: string
  retrievedAt: string
}

/** Related headlines only — never the body text of a news article. */
export type GkCoverage = { headline: string; url: string; sourceName: string; date?: string }

/**
 * A topic page. Curated GK topics are seeded once and edited by hand; current
 * affairs topics are gathered from free sources and refreshed in place, so the
 * same topic always lands in the same row rather than accumulating duplicates.
 */
export const gkTopics = pgTable(
  'gk_topics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    kind: gkTopicKind('kind').notNull(),
    slug: text('slug').notNull(),
    titleEn: text('title_en').notNull(),
    titleUr: text('title_ur'),
    section: text('section').notNull(),
    summaryEn: text('summary_en').notNull(),
    summaryUr: text('summary_ur'),
    issbAngle: text('issb_angle'),
    facts: jsonb('facts').$type<GkFact[]>().notNull().default([]),
    points: jsonb('points').$type<GkPointGroup[]>().notNull().default([]),
    timeline: jsonb('timeline').$type<GkTimelineEntry[]>().notNull().default([]),
    sources: jsonb('sources').$type<GkSource[]>().notNull().default([]),
    coverage: jsonb('coverage').$type<GkCoverage[]>().notNull().default([]),
    /** Extra words to match headlines on, where the title alone is too generic. */
    coverageKeywords: jsonb('coverage_keywords').$type<string[]>().notNull().default([]),
    /** 'curated' = written by us and seeded; 'gathered' = built by the job. */
    origin: text('origin').notNull().default('curated'),
    /** Which model wrote the narrative, or null when facts-only. */
    narrativeModel: text('narrative_model'),
    status: contentStatus('status').notNull().default('published'),
    lastGatheredAt: timestamp('last_gathered_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('gk_topics_kind_slug_key').on(t.kind, t.slug),
    index('gk_topics_kind_section_idx').on(t.kind, t.section),
    index('gk_topics_status_idx').on(t.status),
  ],
)

export type GkTopic = typeof gkTopics.$inferSelect

export type GkArticle = typeof gkArticles.$inferSelect
export type Flashcard = typeof flashcards.$inferSelect
