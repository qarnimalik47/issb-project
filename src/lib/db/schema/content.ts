/**
 * Content tables: test types (reference), question banks, questions, media,
 * rubrics, and the PDF-import staging area.
 *
 * Designed in Phase 1; CRUD, import and rubric management are built in Phase 2.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { users } from './identity'
import { testDimension, scoringType, contentStatus, locale, stagingStatus } from './enums'

export const testTypes = pgTable(
  'test_types',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    code: text('code').notNull(),
    nameEn: text('name_en').notNull(),
    nameUr: text('name_ur').notNull(),
    dimension: testDimension('dimension').notNull(),
    scoringType: scoringType('scoring_type').notNull(),
    // Timing config, e.g. { perItemSeconds, totalSeconds, viewSeconds, writeSeconds, itemCount }
    timing: jsonb('timing').notNull().default({}),
    description: text('description'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('test_types_code_key').on(t.code)],
)

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    kind: text('kind').notNull(), // 'nonverbal_figure' | 'story_picture' | 'answer_sheet' | 'voice' | 'report'
    storageKey: text('storage_key').notNull(),
    mime: text('mime').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    meta: jsonb('meta'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('media_assets_kind_idx').on(t.kind)],
)

export const questionBanks = pgTable(
  'question_banks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    testTypeId: uuid('test_type_id')
      .notNull()
      .references(() => testTypes.id, { onDelete: 'restrict' }),
    title: text('title').notNull(),
    description: text('description'),
    difficulty: text('difficulty').notNull().default('mixed'),
    topic: text('topic'),
    locale: locale('locale').notNull().default('en'),
    status: contentStatus('status').notNull().default('draft'),
    version: integer('version').notNull().default(1),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('question_banks_test_type_idx').on(t.testTypeId),
    index('question_banks_status_idx').on(t.status),
  ],
)

export const questions = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bankId: uuid('bank_id').references(() => questionBanks.id, { onDelete: 'cascade' }),
    testTypeId: uuid('test_type_id')
      .notNull()
      .references(() => testTypes.id, { onDelete: 'restrict' }),
    stemEn: text('stem_en').notNull(),
    stemUr: text('stem_ur'),
    // options: [{ key: 'A', textEn, textUr }]
    options: jsonb('options'),
    correctOption: text('correct_option'),
    explanationEn: text('explanation_en'),
    explanationUr: text('explanation_ur'),
    mediaId: uuid('media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
    difficulty: text('difficulty').notNull().default('medium'),
    topic: text('topic'),
    contentHash: text('content_hash').notNull(),
    status: contentStatus('status').notNull().default('draft'),
    version: integer('version').notNull().default(1),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('questions_bank_idx').on(t.bankId),
    index('questions_test_type_idx').on(t.testTypeId),
    index('questions_status_idx').on(t.status),
    index('questions_topic_idx').on(t.topic),
    uniqueIndex('questions_content_hash_key').on(t.contentHash),
  ],
)

export const rubrics = pgTable(
  'rubrics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    testTypeId: uuid('test_type_id')
      .notNull()
      .references(() => testTypes.id, { onDelete: 'restrict' }),
    version: integer('version').notNull(),
    name: text('name').notNull(),
    // criteria: [{ key, label, description, scale }]
    criteria: jsonb('criteria').notNull(),
    // JSON schema the model output must satisfy
    outputSchema: jsonb('output_schema').notNull(),
    status: contentStatus('status').notNull().default('draft'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('rubrics_test_type_version_key').on(t.testTypeId, t.version)],
)

export const importBatches = pgTable(
  'import_batches',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    source: text('source').notNull(), // 'upload' | 'path'
    filename: text('filename').notNull(),
    status: text('status').notNull().default('parsing'), // parsing | ready | failed
    totalPages: integer('total_pages'),
    testTypeId: uuid('test_type_id').references(() => testTypes.id, { onDelete: 'set null' }),
    meta: jsonb('meta'),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('import_batches_status_idx').on(t.status)],
)

export const stagingQuestions = pgTable(
  'staging_questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    batchId: uuid('batch_id')
      .notNull()
      .references(() => importBatches.id, { onDelete: 'cascade' }),
    page: integer('page'),
    // extracted: { stemEn, stemUr, options, correctOption, explanation }
    extracted: jsonb('extracted').notNull(),
    contentHash: text('content_hash').notNull(),
    confidence: numeric('confidence'),
    status: stagingStatus('status').notNull().default('pending'),
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('staging_questions_batch_idx').on(t.batchId),
    index('staging_questions_status_idx').on(t.status),
  ],
)

export type TestType = typeof testTypes.$inferSelect
export type Question = typeof questions.$inferSelect
export type Rubric = typeof rubrics.$inferSelect
