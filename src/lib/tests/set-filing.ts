/**
 * Keep numbered test sets in step with items an admin publishes one at a time.
 *
 * scripts/build-test-sets.ts divides a whole bank once. After that, a picture
 * or planning scenario published from the admin panel would sit in the free
 * practice pool but in no numbered set. These two functions file a newly live
 * item into a set, and take a withdrawn one back out.
 *
 * The rule both follow: a set somebody has already attempted is never changed,
 * so a candidate's "Test 3" is the same test when they come back to it.
 */
import { asc, count, desc, eq, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { questionBanks, questions, testTypes } from '../db/schema/content'
import { attempts } from '../db/schema/attempts'

/** Mirrors the fallbacks in scripts/build-test-sets.ts for types with no itemCount. */
const SET_SIZE_FALLBACK: Record<string, number> = { gpe: 4, pointer_story: 4, essay: 4 }
const DEFAULT_SIZE = 25

async function isAttempted(bankId: string): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(attempts).where(eq(attempts.bankId, bankId))
  return (row?.n ?? 0) > 0
}

/**
 * Put a published, set-less question into the newest set of its type when that
 * set has room and has never been attempted; otherwise open the next set.
 * Returns the bank it landed in, or null when there was nothing to do.
 */
export async function fileIntoSet(questionId: string): Promise<string | null> {
  const [q] = await db
    .select({
      id: questions.id,
      bankId: questions.bankId,
      status: questions.status,
      testTypeId: questions.testTypeId,
    })
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1)
  if (!q || q.status !== 'published' || q.bankId) return null

  const [tt] = await db
    .select({ code: testTypes.code, nameEn: testTypes.nameEn, timing: testTypes.timing })
    .from(testTypes)
    .where(eq(testTypes.id, q.testTypeId))
    .limit(1)
  if (!tt) return null
  const timing = (tt.timing ?? {}) as { itemCount?: number }
  const size =
    timing.itemCount && timing.itemCount > 0
      ? timing.itemCount
      : (SET_SIZE_FALLBACK[tt.code] ?? DEFAULT_SIZE)

  const [latest] = await db
    .select({ id: questionBanks.id, status: questionBanks.status })
    .from(questionBanks)
    .where(eq(questionBanks.testTypeId, q.testTypeId))
    .orderBy(desc(questionBanks.createdAt), desc(questionBanks.id))
    .limit(1)

  if (latest && latest.status === 'published') {
    const [fill] = await db
      .select({
        total: count(),
        live: sql<number>`count(*) filter (where ${questions.status} = 'published')`.mapWith(
          Number,
        ),
      })
      .from(questions)
      .where(eq(questions.bankId, latest.id))
    const total = fill?.total ?? 0
    if (total < size && total === (fill?.live ?? 0) && !(await isAttempted(latest.id))) {
      await db.update(questions).set({ bankId: latest.id }).where(eq(questions.id, q.id))
      return latest.id
    }
  }

  // Number after the highest existing title, not the count: a removed empty
  // set must not make the next one reuse its number.
  const titles = await db
    .select({ title: questionBanks.title })
    .from(questionBanks)
    .where(eq(questionBanks.testTypeId, q.testTypeId))
  const n = Math.max(0, ...titles.map((t) => Number(/^Test (\d+)$/.exec(t.title)?.[1] ?? 0)))
  const [bank] = await db
    .insert(questionBanks)
    .values({
      testTypeId: q.testTypeId,
      title: `Test ${n + 1}`,
      description: `Items from the ${tt.nameEn} bank.`,
      difficulty: 'mixed',
      locale: 'en',
      status: 'published',
      version: 1,
    })
    .returning({ id: questionBanks.id })
  await db.update(questions).set({ bankId: bank!.id }).where(eq(questions.id, q.id))
  return bank!.id
}

/**
 * Detach a question that is being unpublished or deleted, unless its set has
 * been attempted (the player already skips unpublished items in a set). A set
 * left empty is removed so the list never shows a "Test 7" with nothing in it.
 */
export async function withdrawFromSet(questionId: string): Promise<void> {
  const [q] = await db
    .select({ bankId: questions.bankId })
    .from(questions)
    .where(eq(questions.id, questionId))
    .limit(1)
  if (!q?.bankId || (await isAttempted(q.bankId))) return
  await db.update(questions).set({ bankId: null }).where(eq(questions.id, questionId))
  const [left] = await db
    .select({ n: count() })
    .from(questions)
    .where(eq(questions.bankId, q.bankId))
  if ((left?.n ?? 0) === 0) {
    await db.delete(questionBanks).where(eq(questionBanks.id, q.bankId))
  }
}

/** The set list for a type, oldest first — used by the admin pages to show where items sit. */
export async function setTitles(testTypeId: string): Promise<Map<string, string>> {
  const rows = await db
    .select({ id: questionBanks.id, title: questionBanks.title })
    .from(questionBanks)
    .where(eq(questionBanks.testTypeId, testTypeId))
    .orderBy(asc(questionBanks.createdAt))
  return new Map(rows.map((r) => [r.id, r.title]))
}
