/**
 * Seed baseline data. Idempotent: safe to run repeatedly.
 *
 * Phase 0 seeds only foundational app_metadata rows. Domain seed data (test
 * types, sample question banks, rubrics) arrives in later phases.
 *
 *   npm run db:seed
 */
import 'dotenv/config'
import { sql as rawSql } from '../src/lib/db/index'
import { db } from '../src/lib/db/index'
import { appMetadata, testTypes, questions, rubrics, plans } from '../src/lib/db/schema'
import { TEST_TYPES } from '../src/lib/db/seed-data/test-types'
import { SAMPLE_QUESTIONS } from '../src/lib/db/seed-data/sample-questions'
import { WRITTEN_ITEMS } from '../src/lib/db/seed-data/written-items'
import {
  DEFAULT_RUBRIC_CRITERIA,
  DEFAULT_RUBRIC_OUTPUT_SCHEMA,
} from '../src/lib/db/seed-data/rubrics'
import { PLANS } from '../src/lib/billing/plans'
import { questionContentHash } from '../src/lib/import/parse'
import { eq, and } from 'drizzle-orm'

async function main() {
  const rows = [
    {
      key: 'schema.baseline',
      value: { phase: 0, note: 'Foundation baseline' },
      description: 'Marks the Phase 0 schema baseline.',
    },
    {
      key: 'seed.status',
      value: { seeded: true },
      description: 'Set once the seed script has run successfully.',
    },
  ]

  for (const row of rows) {
    await db
      .insert(appMetadata)
      .values(row)
      .onConflictDoUpdate({
        target: appMetadata.key,
        set: { value: row.value, description: row.description, updatedAt: new Date() },
      })
  }
  console.warn(`✓ Seeded ${rows.length} app_metadata row(s).`)

  // Reference: ISSB test types (idempotent upsert by code).
  for (const tt of TEST_TYPES) {
    await db
      .insert(testTypes)
      .values(tt)
      .onConflictDoUpdate({
        target: testTypes.code,
        set: {
          nameEn: tt.nameEn,
          nameUr: tt.nameUr,
          dimension: tt.dimension,
          scoringType: tt.scoringType,
          timing: tt.timing,
          sortOrder: tt.sortOrder,
        },
      })
  }
  console.warn(`✓ Seeded ${TEST_TYPES.length} test type(s).`)

  // Sample published questions (our own content) to demonstrate the engine.
  const typeByCode = new Map((await db.select().from(testTypes)).map((t) => [t.code, t.id]))
  let seededQ = 0
  for (const sq of SAMPLE_QUESTIONS) {
    const testTypeId = typeByCode.get(sq.testTypeCode)
    if (!testTypeId) continue
    const contentHash = questionContentHash(sq.stemEn, sq.options)
    const res = await db
      .insert(questions)
      .values({
        testTypeId,
        stemEn: sq.stemEn,
        stemUr: sq.stemUr,
        options: sq.options,
        correctOption: sq.correctOption,
        explanationEn: sq.explanationEn,
        topic: sq.topic,
        difficulty: sq.difficulty,
        contentHash,
        status: 'published',
      })
      .onConflictDoUpdate({
        target: questions.contentHash,
        set: { status: 'published', updatedAt: new Date() },
      })
      .returning({ id: questions.id })
    if (res[0]) seededQ++
  }
  console.warn(`✓ Seeded ${seededQ} sample question(s).`)

  // Sample written items (WAT/SCT/SRT/essay/etc).
  let seededW = 0
  for (const wi of WRITTEN_ITEMS) {
    const testTypeId = typeByCode.get(wi.testTypeCode)
    if (!testTypeId) continue
    const contentHash = questionContentHash(wi.stemEn, [])
    const res = await db
      .insert(questions)
      .values({
        testTypeId,
        stemEn: wi.stemEn,
        stemUr: wi.stemUr,
        topic: wi.topic,
        contentHash,
        status: 'published',
      })
      .onConflictDoUpdate({
        target: questions.contentHash,
        set: { status: 'published', updatedAt: new Date() },
      })
      .returning({ id: questions.id })
    if (res[0]) seededW++
  }
  console.warn(`✓ Seeded ${seededW} written item(s).`)

  // Default rubric (v1) for each rubric-scored test type.
  const rubricTypes = (await db.select().from(testTypes)).filter((t) => t.scoringType === 'rubric')
  let seededR = 0
  for (const tt of rubricTypes) {
    const existing = await db
      .select({ id: rubrics.id })
      .from(rubrics)
      .where(and(eq(rubrics.testTypeId, tt.id), eq(rubrics.version, 1)))
      .limit(1)
    if (existing[0]) continue
    await db.insert(rubrics).values({
      testTypeId: tt.id,
      version: 1,
      name: `${tt.nameEn} — default rubric`,
      criteria: DEFAULT_RUBRIC_CRITERIA,
      outputSchema: DEFAULT_RUBRIC_OUTPUT_SCHEMA,
      status: 'published',
    })
    seededR++
  }
  console.warn(`✓ Seeded ${seededR} rubric(s).`)

  // Plans.
  for (const [code, p] of Object.entries(PLANS)) {
    await db
      .insert(plans)
      .values({
        code,
        nameEn: p.nameEn,
        nameUr: p.nameUr,
        priceCents: p.priceCents,
        currency: p.currency,
        entitlements: p.entitlements,
      })
      .onConflictDoUpdate({
        target: plans.code,
        set: { entitlements: p.entitlements, priceCents: p.priceCents },
      })
  }
  console.warn(`✓ Seeded ${Object.keys(PLANS).length} plan(s).`)
}

try {
  await main()
} catch (err) {
  console.error('✗ Seed failed:', err)
  process.exitCode = 1
} finally {
  await rawSql.end()
}
