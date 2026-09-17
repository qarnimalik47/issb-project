import { db } from '@/lib/db'
import { testTypes, questions } from '@/lib/db/schema/content'
import { and, eq, sql } from 'drizzle-orm'
import { getT } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

export default async function PracticePage() {
  const { locale } = await getT()
  const rows = await db
    .select({
      id: testTypes.id,
      code: testTypes.code,
      nameEn: testTypes.nameEn,
      nameUr: testTypes.nameUr,
      count: sql<number>`count(${questions.id})`.mapWith(Number),
    })
    .from(testTypes)
    .leftJoin(
      questions,
      and(eq(questions.testTypeId, testTypes.id), eq(questions.status, 'published')),
    )
    .where(eq(testTypes.scoringType, 'objective'))
    .groupBy(testTypes.id)
    .orderBy(testTypes.sortOrder)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Practice tests</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="font-medium">{locale === 'ur' ? r.nameUr : r.nameEn}</div>
            <div className="mt-1 text-sm text-neutral-500">{r.count} questions available</div>
            {r.count > 0 ? (
              <a
                href={`/practice/${r.id}`}
                className="mt-3 inline-block rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
              >
                Start
              </a>
            ) : (
              <span className="mt-3 inline-block text-sm text-neutral-400">Coming soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
