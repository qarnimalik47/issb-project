/**
 * The numbered tests for one test type: click SCT, get SCT Test 1..5 with your
 * progress against each. Sits at /practice/sets/<code> rather than
 * /practice/<code> because /practice/[id] is already the exam player.
 */
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getT } from '@/lib/i18n'
import { interpolate } from '@/lib/i18n/format'
import { listTestSets, type TestSet } from '@/lib/tests/sets'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ButtonLink } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

/** Where a set is played depends on how it is scored. */
function playHref(scoringType: string, testTypeId: string, setId: string): string {
  return scoringType === 'objective'
    ? `/practice/${testTypeId}?set=${setId}`
    : `/written/${testTypeId}?set=${setId}`
}

function stateBadge(set: TestSet, t: Record<string, string>) {
  if (set.state === 'done') return <Badge tone="green">{t.done}</Badge>
  if (set.state === 'in_progress') return <Badge tone="brass">{t.inProgress}</Badge>
  if (set.state === 'locked') return <Badge tone="neutral">{t.locked}</Badge>
  return null
}

export default async function TestSetsPage({ params }: { params: Promise<{ code: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { code } = await params
  const { locale, t } = await getT()
  const s = t.testSets

  const data = await listTestSets(user.id, code)
  if (!data) notFound()

  const { testType, sets, doneCount } = data
  const name = locale === 'ur' ? testType.nameUr : testType.nameEn

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <ButtonLink href="/practice" variant="ghost" className="self-start">
          ← {s.backToPractice}
        </ButtonLink>
        <PageHeader title={interpolate(s.heading, { name })} lede={s.lede} />
      </div>

      {sets.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-muted">{s.noSets}</p>
        </Card>
      ) : (
        <>
          <p className="text-sm text-ink-muted tabular-nums">
            {interpolate(s.progress, { done: doneCount, total: sets.length })}
          </p>

          <ul className="grid list-none gap-3 p-0 sm:grid-cols-2">
            {sets.map((set) => {
              const playable = set.state !== 'locked'
              const label =
                set.state === 'in_progress' ? s.resume : set.state === 'done' ? s.retake : s.start
              return (
                <li key={set.id}>
                  <Card
                    data-testid={`test-set-${set.id}`}
                    data-state={set.state}
                    className="flex h-full flex-col"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-base font-semibold text-ink">{set.title}</h2>
                      {stateBadge(set, s as unknown as Record<string, string>)}
                    </div>

                    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
                      <div>
                        <dt className="sr-only">{s.labelItems}</dt>
                        <dd className="m-0">
                          {interpolate(s.itemCount, { count: set.itemCount })}
                        </dd>
                      </div>
                      {set.bestPercentage != null && (
                        <div>
                          <dt className="sr-only">{s.labelBest}</dt>
                          <dd className="m-0 tabular-nums">
                            {interpolate(s.bestScore, { percentage: set.bestPercentage })}
                          </dd>
                        </div>
                      )}
                      {set.attemptCount > 1 && (
                        <div>
                          <dt className="sr-only">{s.labelAttempts}</dt>
                          <dd className="m-0 tabular-nums">
                            {interpolate(s.attempts, { count: set.attemptCount })}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-4 flex items-center gap-3 pt-1">
                      {playable ? (
                        <ButtonLink
                          href={playHref(testType.scoringType, testType.id, set.id)}
                          variant={set.state === 'in_progress' ? 'brass' : 'primary'}
                        >
                          {label}
                        </ButtonLink>
                      ) : (
                        <span className="text-sm text-ink-muted">
                          {interpolate(s.lockedHint, {
                            ready: set.readyCount,
                            total: set.itemCount,
                          })}
                        </span>
                      )}
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
