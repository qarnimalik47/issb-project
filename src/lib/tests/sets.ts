/**
 * Numbered practice tests ("sets") for a test type, with this user's progress
 * against each one.
 *
 * A set is a `question_banks` row built by scripts/build-test-sets.ts. Attempts
 * record which set they ran (`attempts.bank_id`), which is what lets the list
 * mark a set done rather than just showing "you have practised Verbal before".
 */
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { testTypes, questionBanks, questions } from '../db/schema/content'
import { attempts } from '../db/schema/attempts'

export type TestSetState = 'done' | 'in_progress' | 'available' | 'locked'

export type TestSet = {
  id: string
  title: string
  description: string | null
  itemCount: number
  /** Items actually publishable — a set is only playable when this equals itemCount. */
  readyCount: number
  state: TestSetState
  attemptId: string | null
  /** Best percentage across submitted attempts, for objective tests. */
  bestPercentage: number | null
  attemptCount: number
  lastAttemptAt: Date | null
}

export type TestTypeSets = {
  testType: {
    id: string
    code: string
    nameEn: string
    nameUr: string
    scoringType: 'objective' | 'rubric' | 'consistency'
    timing: Record<string, number>
  }
  sets: TestSet[]
  doneCount: number
  playableCount: number
}

/** Finished for the purposes of "is this marked done?" */
const FINISHED = ['submitted', 'evaluated'] as const

export async function getTestTypeByCode(code: string) {
  const [tt] = await db
    .select({
      id: testTypes.id,
      code: testTypes.code,
      nameEn: testTypes.nameEn,
      nameUr: testTypes.nameUr,
      scoringType: testTypes.scoringType,
      timing: testTypes.timing,
    })
    .from(testTypes)
    .where(eq(testTypes.code, code))
    .limit(1)
  return tt ?? null
}

/**
 * Every set for one test type, in order, annotated with this user's progress.
 */
export async function listTestSets(userId: string, code: string): Promise<TestTypeSets | null> {
  const tt = await getTestTypeByCode(code)
  if (!tt) return null

  const banks = await db
    .select({
      id: questionBanks.id,
      title: questionBanks.title,
      description: questionBanks.description,
      status: questionBanks.status,
      createdAt: questionBanks.createdAt,
    })
    .from(questionBanks)
    .where(eq(questionBanks.testTypeId, tt.id))
    .orderBy(asc(questionBanks.createdAt), asc(questionBanks.id))

  if (banks.length === 0) {
    return {
      testType: { ...tt, timing: (tt.timing ?? {}) as Record<string, number> },
      sets: [],
      doneCount: 0,
      playableCount: 0,
    }
  }

  const bankIds = banks.map((b) => b.id)

  // Item counts and how many of them are actually published, per set.
  const counts = await db
    .select({
      bankId: questions.bankId,
      total: sql<number>`count(*)`.mapWith(Number),
      ready: sql<number>`count(*) filter (where ${questions.status} = 'published')`.mapWith(Number),
    })
    .from(questions)
    .where(inArray(questions.bankId, bankIds))
    .groupBy(questions.bankId)
  const countByBank = new Map(counts.map((c) => [c.bankId, c]))

  // This user's attempts against those sets, newest first.
  const mine = await db
    .select({
      id: attempts.id,
      bankId: attempts.bankId,
      status: attempts.status,
      score: attempts.score,
      maxScore: attempts.maxScore,
      submittedAt: attempts.submittedAt,
      startedAt: attempts.startedAt,
    })
    .from(attempts)
    .where(and(eq(attempts.userId, userId), inArray(attempts.bankId, bankIds)))
    .orderBy(desc(attempts.startedAt))

  const byBank = new Map<string, typeof mine>()
  for (const a of mine) {
    if (!a.bankId) continue
    const list = byBank.get(a.bankId) ?? []
    list.push(a)
    byBank.set(a.bankId, list)
  }

  const sets: TestSet[] = banks.map((b) => {
    const c = countByBank.get(b.id)
    const itemCount = c?.total ?? 0
    const readyCount = c?.ready ?? 0
    const history = byBank.get(b.id) ?? []

    const active = history.find((a) => a.status === 'in_progress')
    const finished = history.filter((a) => (FINISHED as readonly string[]).includes(a.status))

    // A set is playable only when the bank is published AND every item in it is.
    // Both gates matter: the bank flag is the human decision, the item count is
    // the mechanical check that nothing draft slipped in.
    const playable = b.status === 'published' && readyCount === itemCount && itemCount > 0

    let state: TestSetState
    if (finished.length > 0) state = 'done'
    else if (active) state = 'in_progress'
    else if (playable) state = 'available'
    else state = 'locked'

    const percentages = finished
      .map((a) =>
        a.score != null && a.maxScore != null && Number(a.maxScore) > 0
          ? (Number(a.score) / Number(a.maxScore)) * 100
          : null,
      )
      .filter((p): p is number => p != null)

    return {
      id: b.id,
      title: b.title,
      description: b.description,
      itemCount,
      readyCount,
      state,
      attemptId: active?.id ?? finished[0]?.id ?? null,
      bestPercentage: percentages.length ? Math.round(Math.max(...percentages)) : null,
      attemptCount: finished.length,
      lastAttemptAt: finished[0]?.submittedAt ?? finished[0]?.startedAt ?? null,
    }
  })

  return {
    testType: { ...tt, timing: (tt.timing ?? {}) as Record<string, number> },
    sets,
    doneCount: sets.filter((s) => s.state === 'done').length,
    playableCount: sets.filter((s) => s.state !== 'locked').length,
  }
}

/** Per-type totals for the practice index: how many sets, how many done. */
export async function getSetProgressByType(userId: string) {
  const rows = await db
    .select({
      testTypeId: questionBanks.testTypeId,
      total: sql<number>`count(distinct ${questionBanks.id})`.mapWith(Number),
      playable:
        sql<number>`count(distinct ${questionBanks.id}) filter (where ${questionBanks.status} = 'published')`.mapWith(
          Number,
        ),
    })
    .from(questionBanks)
    .groupBy(questionBanks.testTypeId)

  const done = await db
    .select({
      testTypeId: attempts.testTypeId,
      done: sql<number>`count(distinct ${attempts.bankId})`.mapWith(Number),
    })
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        inArray(attempts.status, [...FINISHED]),
        sql`${attempts.bankId} is not null`,
      ),
    )
    .groupBy(attempts.testTypeId)

  const doneByType = new Map(done.map((d) => [d.testTypeId, d.done]))
  return new Map(
    rows.map((r) => [
      r.testTypeId,
      { total: r.total, playable: r.playable, done: doneByType.get(r.testTypeId) ?? 0 },
    ]),
  )
}
