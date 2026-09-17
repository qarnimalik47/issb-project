/**
 * Attempt tables: test attempts, MCQ responses, written responses, immutable
 * evaluations, and personality profile snapshots.
 *
 * Designed in Phase 1; the objective engine (Phase 3), written capture
 * (Phase 4), AI evaluation (Phase 5) and profile (Phase 6) fill these in.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './identity'
import { testTypes, questionBanks, questions, mediaAssets } from './content'
import { attemptMode, attemptStatus, evaluationStatus } from './enums'

export const attempts = pgTable(
  'attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    testTypeId: uuid('test_type_id')
      .notNull()
      .references(() => testTypes.id, { onDelete: 'restrict' }),
    bankId: uuid('bank_id').references(() => questionBanks.id, { onDelete: 'set null' }),
    mode: attemptMode('mode').notNull().default('typed'),
    status: attemptStatus('status').notNull().default('in_progress'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    // Server-authoritative deadline for the whole attempt (rule 1.5).
    deadlineAt: timestamp('deadline_at', { withTimezone: true }),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds'),
    score: numeric('score'),
    maxScore: numeric('max_score'),
    // Question order + per-attempt config, fixed server-side at start.
    config: jsonb('config'),
    timingMeta: jsonb('timing_meta'),
    // Autosave blob for resume-after-disconnect.
    autosave: jsonb('autosave'),
    // tab-visibility / focus events for anti-cheat basics
    integrityEvents: jsonb('integrity_events'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('attempts_user_idx').on(t.userId),
    index('attempts_test_type_idx').on(t.testTypeId),
    index('attempts_status_idx').on(t.status),
    index('attempts_user_status_idx').on(t.userId, t.status),
    // At most one in-progress attempt per user per test type (rule 3 anti-cheat:
    // "one active attempt per test"). Enforced in the DB so concurrent requests
    // cannot create duplicates.
    uniqueIndex('attempts_one_active_per_type')
      .on(t.userId, t.testTypeId)
      .where(sql`${t.status} = 'in_progress'`),
  ],
)

export const mcqResponses = pgTable(
  'mcq_responses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id, { onDelete: 'restrict' }),
    selectedOption: text('selected_option'),
    isCorrect: boolean('is_correct'),
    timeMs: integer('time_ms'),
    orderIndex: integer('order_index').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('mcq_responses_attempt_idx').on(t.attemptId),
    index('mcq_responses_question_idx').on(t.questionId),
  ],
)

export const writtenResponses = pgTable(
  'written_responses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => attempts.id, { onDelete: 'cascade' }),
    // Identifies the item within the test (e.g. word index, sentence index).
    itemRef: text('item_ref').notNull(),
    prompt: text('prompt').notNull(),
    responseText: text('response_text'),
    imageMediaId: uuid('image_media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
    ocrText: text('ocr_text'),
    ocrConfirmed: boolean('ocr_confirmed').notNull().default(false),
    timingMeta: jsonb('timing_meta'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('written_responses_attempt_idx').on(t.attemptId),
    uniqueIndex('written_responses_attempt_item_key').on(t.attemptId, t.itemRef),
  ],
)

/**
 * Evaluations are IMMUTABLE (rule 1.5). Re-evaluation inserts a new row; it
 * never updates an old one. Every field needed for audit/reproducibility is
 * stored.
 */
export const evaluations = pgTable(
  'evaluations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subjectType: text('subject_type').notNull(), // 'written_response' | 'attempt' | 'interview'
    subjectId: uuid('subject_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    testTypeId: uuid('test_type_id').references(() => testTypes.id, { onDelete: 'set null' }),
    model: text('model').notNull(),
    modelVersion: text('model_version').notNull(),
    promptVersion: text('prompt_version').notNull(),
    rubricVersion: text('rubric_version'),
    inputHash: text('input_hash').notNull(),
    rawOutput: text('raw_output'),
    parsedOutput: jsonb('parsed_output'),
    tokensInput: integer('tokens_input'),
    tokensOutput: integer('tokens_output'),
    costUsd: numeric('cost_usd'),
    latencyMs: integer('latency_ms'),
    status: evaluationStatus('status').notNull().default('pending'),
    // When two models cross-check, links the pair and flags disagreement.
    crosscheckGroup: uuid('crosscheck_group'),
    disagreement: boolean('disagreement').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('evaluations_subject_idx').on(t.subjectType, t.subjectId),
    index('evaluations_user_idx').on(t.userId),
    index('evaluations_status_idx').on(t.status),
    index('evaluations_crosscheck_idx').on(t.crosscheckGroup),
  ],
)

export const profileSnapshots = pgTable(
  'profile_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // qualities: { responsibility: { score, evidence[] }, ... }
    qualities: jsonb('qualities').notNull(),
    contradictions: jsonb('contradictions'),
    authenticity: jsonb('authenticity'),
    confidence: numeric('confidence').notNull(),
    testsCompleted: integer('tests_completed').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('profile_snapshots_user_idx').on(t.userId, t.createdAt)],
)

export type Attempt = typeof attempts.$inferSelect
export type McqResponse = typeof mcqResponses.$inferSelect
export type WrittenResponse = typeof writtenResponses.$inferSelect
export type Evaluation = typeof evaluations.$inferSelect
