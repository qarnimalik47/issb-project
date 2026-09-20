import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { attempts } from '@/lib/db/schema/attempts'
import { testTypes, questions } from '@/lib/db/schema/content'
import { getT } from '@/lib/i18n'
import { interpolate } from '@/lib/i18n/format'
import { getCurrentUser } from '@/lib/auth/session'
import { getPracticeOverview } from '@/lib/tests/attempts'
import { Card, Panel, Stat } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const { locale, t } = await getT()
  if (!user) return null

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

  const [totals] = await db
    .select({
      completed: sql<number>`count(*) filter (where ${attempts.status} = 'evaluated')`.mapWith(
        Number,
      ),
      average:
        sql<number>`coalesce(round(avg(case when ${attempts.maxScore}::numeric > 0 then (${attempts.score}::numeric / ${attempts.maxScore}::numeric) * 100 end)), 0)`.mapWith(
          Number,
        ),
    })
    .from(attempts)
    .where(eq(attempts.userId, user.id))

  const { resumable, lastPercentage } = await getPracticeOverview(user.id)
  const d = t.dashboard

  /* What to do next, in priority order: finish what is already open, otherwise
     sit the largest bank not yet scored, otherwise the largest bank. */
  const openRow = rows.find((r) => resumable.has(r.id))
  const unattempted = rows.filter((r) => r.count > 0 && !lastPercentage.has(r.id))
  const byCount = rows.filter((r) => r.count > 0).sort((a, b) => b.count - a.count)
  const target = openRow ?? unattempted[0] ?? byCount[0]
  const completed = totals?.completed ?? 0
  const average = totals?.average ?? 0

  const name = (n: { nameEn: string; nameUr: string }) => (locale === 'ur' ? n.nameUr : n.nameEn)

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title={d.title} lede={d.lede} />

      {!user.emailVerifiedAt && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-brass-200 bg-brass-50 dark:border-brass-700 dark:bg-brass-900/40">
          <p className="text-sm text-brass-800 dark:text-brass-100">{t.profile.emailUnverified}</p>
          <ButtonLink href="/verify" variant="brass" size="sm">
            {d.verifyAction}
          </ButtonLink>
        </Card>
      )}

      <section className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel className="flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-brass-400" aria-hidden="true" />
              <span className="text-sm font-medium text-brand-200">{d.nextUp}</span>
            </div>
            <h2 className="mt-4 font-display text-3xl leading-tight font-bold text-white sm:text-4xl">
              {target ? name(target) : d.objective}
            </h2>
            <p className="mt-3 max-w-md text-brand-100">
              {openRow ? d.resumeLede : target ? d.startLede : d.emptyLede}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {target && (
              <ButtonLink href={`/practice/${target.id}`} variant="brass" size="lg">
                {openRow ? d.resume : d.start}
              </ButtonLink>
            )}
            <ButtonLink
              href="/practice"
              size="lg"
              className="border border-brand-600 bg-transparent text-brand-100 hover:bg-brand-700"
            >
              {d.browse}
            </ButtonLink>
          </div>
        </Panel>

        <Card className="flex flex-col justify-center gap-6 p-6">
          <div className="flex items-start justify-between gap-4">
            <Stat value={completed} label={d.completed} />
            {openRow && <Badge tone="brass">{d.inProgress}</Badge>}
          </div>
          <div className="h-px bg-line" />
          <Stat
            value={completed > 0 ? `${average}%` : '—'}
            label={d.average}
            tone={completed > 0 ? 'brass' : 'ink'}
          />
        </Card>
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">{d.objective}</h2>
          <p className="mt-1 text-sm text-ink-muted">{d.objectiveLede}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map((r) => {
            const last = lastPercentage.get(r.id)
            const open = resumable.has(r.id)
            return (
              <Card key={r.id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display leading-snug font-semibold text-ink">{name(r)}</h3>
                  {open && <Badge tone="brass">{t.practice.inProgress}</Badge>}
                </div>
                <div className="mt-auto">
                  {last != null ? (
                    <>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-display text-2xl font-bold tabular-nums text-ink">
                          {last}%
                        </span>
                        <span className="text-xs text-ink-muted">
                          {interpolate(t.practice.questionsAvailable, { count: r.count })}
                        </span>
                      </div>
                      <Progress
                        value={last}
                        label={`${name(r)} ${last}%`}
                        className="mt-3"
                        tone={last >= 60 ? 'green' : 'brass'}
                      />
                    </>
                  ) : (
                    <p className="text-sm text-ink-muted">
                      {r.count > 0 ? d.notAttempted : t.practice.comingSoon}
                    </p>
                  )}
                </div>
                {r.count > 0 && (
                  <ButtonLink href={`/practice/${r.id}`} variant="outline" size="sm">
                    {open ? t.practice.resume : t.practice.start}
                  </ButtonLink>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">{d.elsewhere}</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: '/written', label: t.nav.written, blurb: d.writtenBlurb },
            { href: '/voice', label: t.nav.voice, blurb: d.voiceBlurb },
            { href: '/gk', label: t.nav.gk, blurb: d.gkBlurb },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-card border border-line bg-surface p-5 transition-colors hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950"
            >
              <h3 className="font-display font-semibold text-ink">{item.label}</h3>
              <p className="mt-1.5 text-sm text-ink-muted">{item.blurb}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
