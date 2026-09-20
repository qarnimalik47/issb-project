/**
 * Divide every test type's questions into numbered practice tests.
 *
 * A "test" is a `question_banks` row; its questions point back via
 * `questions.bank_id`, and an attempt records which bank it ran
 * (`attempts.bank_id`). The schema already modelled all three — this fills them
 * in, because until now every attempt sampled the whole pool at random and
 * there was nothing for a learner to work through in order.
 *
 * Sizing comes from each test type's own `timing.itemCount` where it has one,
 * so a Verbal set is the 50 items the real test runs. The types with no
 * itemCount get the defaults in SET_SIZE below.
 *
 * A bank is published only when every question in it is published, so the
 * imported (draft) material cannot go live by accident — see
 * storage/content-import/README.md.
 *
 *   npx tsx scripts/build-test-sets.ts            # report what it would build
 *   npx tsx scripts/build-test-sets.ts --apply
 *   npx tsx scripts/build-test-sets.ts --apply --force   # rebuild unattempted sets
 */
import 'dotenv/config'
import { asc, eq, inArray, sql as dsql } from 'drizzle-orm'
import { db, sql as rawSql } from '../src/lib/db/index'
import { testTypes, questionBanks, questions } from '../src/lib/db/schema/content'
import { attempts } from '../src/lib/db/schema/attempts'

const apply = process.argv.includes('--apply')
const force = process.argv.includes('--force')

/** Fallbacks for test types whose timing config carries no itemCount. */
const SET_SIZE: Record<string, number> = {
  wat: 50, // a real WAT runs ~80-100 words; 50 keeps sets reviewable
  group_discussion: 10, // a session covers a handful of topics
  lecturette: 10, // a candidate picks from a short list
  pointer_story: 4,
  self_description: 4,
  essay: 4,
  gpe: 4,
  piq: 1,
  interview: 10,
  opi: 25, // its declared itemCount (150) is a full bank, not one sitting
}
const DEFAULT_SIZE = 25

/**
 * Split into fixed-size chunks, then fold a short tail back into the previous
 * chunk. Without this, 103 mechanical questions at 50 per set leaves a
 * third "test" of 3 items, which reads as broken rather than as a short set.
 */
function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return []
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  if (out.length > 1 && out[out.length - 1]!.length < Math.max(2, Math.floor(size / 2))) {
    const tail = out.pop()!
    out[out.length - 1]!.push(...tail)
  }
  return out
}

async function main() {
  const types = await db
    .select({
      id: testTypes.id,
      code: testTypes.code,
      nameEn: testTypes.nameEn,
      timing: testTypes.timing,
      sortOrder: testTypes.sortOrder,
    })
    .from(testTypes)
    .orderBy(asc(testTypes.sortOrder))

  let createdTotal = 0
  const summary: {
    code: string
    questions: number
    sets: number
    sizes: number[]
    live: number
    action: string
  }[] = []

  for (const tt of types) {
    // Deterministic order, so a rebuild reproduces the same sets.
    const pool = await db
      .select({ id: questions.id, status: questions.status })
      .from(questions)
      .where(eq(questions.testTypeId, tt.id))
      .orderBy(asc(questions.createdAt), asc(questions.id))

    if (pool.length === 0) {
      summary.push({
        code: tt.code,
        questions: 0,
        sets: 0,
        sizes: [],
        live: 0,
        action: 'no questions',
      })
      continue
    }

    const existing = await db
      .select({ id: questionBanks.id })
      .from(questionBanks)
      .where(eq(questionBanks.testTypeId, tt.id))

    if (existing.length > 0) {
      if (!force) {
        summary.push({
          code: tt.code,
          questions: pool.length,
          sets: existing.length,
          sizes: [],
          live: 0,
          action: 'already built (use --force to rebuild)',
        })
        continue
      }
      // Never discard a set someone has already attempted.
      const attempted = await db
        .select({ bankId: attempts.bankId })
        .from(attempts)
        .where(
          inArray(
            attempts.bankId,
            existing.map((e) => e.id),
          ),
        )
      if (attempted.length > 0) {
        summary.push({
          code: tt.code,
          questions: pool.length,
          sets: existing.length,
          sizes: [],
          live: 0,
          action: `kept — ${attempted.length} attempt(s) reference these sets`,
        })
        continue
      }
      if (apply) {
        await db
          .update(questions)
          .set({ bankId: null })
          .where(
            inArray(
              questions.bankId,
              existing.map((e) => e.id),
            ),
          )
        await db.delete(questionBanks).where(eq(questionBanks.testTypeId, tt.id))
      }
    }

    const timing = (tt.timing ?? {}) as { itemCount?: number }
    const size =
      timing.itemCount && timing.itemCount > 0
        ? timing.itemCount
        : (SET_SIZE[tt.code] ?? DEFAULT_SIZE)

    const sets = chunk(pool, size)
    const sizes = sets.map((s) => s.length)
    const live = sets.filter((s) => s.every((q) => q.status === 'published')).length

    if (apply) {
      for (const [i, set] of sets.entries()) {
        const allPublished = set.every((q) => q.status === 'published')
        const [bank] = await db
          .insert(questionBanks)
          .values({
            testTypeId: tt.id,
            title: `Test ${i + 1}`,
            description: `${set.length} items from the ${tt.nameEn} bank.`,
            difficulty: 'mixed',
            locale: 'en',
            // Draft unless every question in the set is live — this is the gate
            // that keeps imported material out of the player.
            status: allPublished ? 'published' : 'draft',
            version: 1,
          })
          .returning({ id: questionBanks.id })
        await db
          .update(questions)
          .set({ bankId: bank!.id })
          .where(
            inArray(
              questions.id,
              set.map((q) => q.id),
            ),
          )
        createdTotal++
      }
    }

    summary.push({
      code: tt.code,
      questions: pool.length,
      sets: sets.length,
      sizes,
      live,
      action: apply ? 'built' : 'would build',
    })
  }

  console.log('')
  console.log('code               questions  sets  live  sizes')
  for (const s of summary) {
    console.log(
      s.code.padEnd(18) +
        String(s.questions).padStart(9) +
        String(s.sets).padStart(6) +
        String(s.live).padStart(6) +
        '  ' +
        (s.sizes.length ? s.sizes.join(', ') : s.action),
    )
  }
  console.log('')
  console.log(
    apply ? `created ${createdTotal} test set(s)` : 'dry run — nothing written (pass --apply)',
  )
  console.log('"live" = sets whose every question is published, so they are playable now.')
}

main()
  .then(() => rawSql.end())
  .catch(async (err) => {
    console.error(err instanceof Error ? err.message : err)
    await rawSql.end().catch(() => {})
    process.exit(1)
  })
