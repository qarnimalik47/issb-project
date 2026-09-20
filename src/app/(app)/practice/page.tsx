import { redirect } from 'next/navigation'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes, questions } from '@/lib/db/schema/content'
import { getCurrentUser } from '@/lib/auth/session'
import { getT } from '@/lib/i18n'
import { interpolate } from '@/lib/i18n/format'
import { getPracticeOverview } from '@/lib/tests/attempts'
import { getSetProgressByType } from '@/lib/tests/sets'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

type Blurbs = Record<string, string>

export default async function PracticePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { locale, t } = await getT()
  const p = t.practice
  const s = t.testSets

  // Every test type, not just the MCQ ones: the written tests (WAT, SCT,
  // group discussion…) are now divided into numbered sets too, so they belong
  // in the same catalogue rather than being reachable only from /written.
  const rows = await db
    .select({
      id: testTypes.id,
      code: testTypes.code,
      nameEn: testTypes.nameEn,
      nameUr: testTypes.nameUr,
      scoringType: testTypes.scoringType,
      timing: testTypes.timing,
      count: sql<number>`count(${questions.id})`.mapWith(Number),
    })
    .from(testTypes)
    .leftJoin(
      questions,
      and(eq(questions.testTypeId, testTypes.id), eq(questions.status, 'published')),
    )
    .groupBy(testTypes.id)
    .orderBy(testTypes.sortOrder)

  const { resumable, lastPercentage } = await getPracticeOverview(user.id)
  const setProgress = await getSetProgressByType(user.id)

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={p.title} lede={p.subtitle} />
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((r) => {
          const timing = (r.timing ?? {}) as { itemCount?: number; totalSeconds?: number }
          const perSet = timing.itemCount ? Math.min(timing.itemCount, r.count) : r.count
          const canResume = resumable.has(r.id)
          const last = lastPercentage.get(r.id)
          const blurb = (p.blurbs as Blurbs)[r.code]
          const progress = setProgress.get(r.id)
          const hasSets = (progress?.total ?? 0) > 0
          return (
            <Card
              key={r.id}
              data-testid={`test-card-${r.code}`}
              className="flex flex-col transition-shadow hover:shadow-raised"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {locale === 'ur' ? r.nameUr : r.nameEn}
                </h2>
                {canResume && <Badge tone="brass">{p.inProgress}</Badge>}
              </div>
              {blurb && <p className="mt-1.5 text-sm text-ink-muted">{blurb}</p>}

              <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                <div>
                  <dt className="sr-only">{p.questionsAvailable}</dt>
                  <dd className="m-0">{interpolate(p.questionsAvailable, { count: r.count })}</dd>
                </div>
                {r.count > 0 && (
                  <>
                    <div>
                      <dt className="sr-only">{p.perSet}</dt>
                      <dd className="m-0">{interpolate(p.perSet, { count: perSet })}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">{p.minutes}</dt>
                      <dd className="m-0">
                        {timing.totalSeconds
                          ? interpolate(p.minutes, {
                              minutes: Math.round(timing.totalSeconds / 60),
                            })
                          : p.untimed}
                      </dd>
                    </div>
                  </>
                )}
                {hasSets && (
                  <div>
                    <dt className="sr-only">{s.labelProgress}</dt>
                    <dd className="m-0 tabular-nums">
                      {interpolate(s.progress, {
                        done: progress!.done,
                        total: progress!.total,
                      })}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-3 pt-1">
                {/*
                 * Objective types keep their direct "Start" — it is the free-practice
                 * path that samples the whole pool, and the e2e flow depends on it.
                 * The set list is the way into the numbered tests, for every type.
                 */}
                {r.scoringType === 'objective' && (r.count > 0 || canResume) && (
                  <ButtonLink href={`/practice/${r.id}`} variant={canResume ? 'brass' : 'primary'}>
                    {canResume ? p.resume : p.start}
                  </ButtonLink>
                )}
                {hasSets ? (
                  <ButtonLink
                    href={`/practice/sets/${r.code}`}
                    variant={r.scoringType === 'objective' ? 'outline' : 'primary'}
                  >
                    {interpolate(p.viewSets, { count: progress!.total })}
                  </ButtonLink>
                ) : (
                  r.count === 0 && <span className="text-sm text-ink-muted">{p.comingSoon}</span>
                )}
                {last != null && (
                  <span className="text-sm text-ink-muted tabular-nums">
                    {interpolate(p.lastScore, { percentage: last })}
                  </span>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
