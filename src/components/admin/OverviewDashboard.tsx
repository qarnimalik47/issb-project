'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Section, ScreenHeader, StatusPill, EmptyState } from './ui/Primitives'
import { StatTile, TierBars } from './charts/Figures'
import { TrendChart } from './charts/TrendChart'
import { change, compact, count, money, percent, usd } from './ui/format'
import { cn } from '@/components/ui/cn'

type Point = { date: string; value: number }

type Metrics = {
  windowDays: number
  users: {
    total: number
    verified: number
    suspended: number
    signupsInWindow: number
    signupsPreviousWindow: number
    activeUsers7d: number
  }
  revenue: {
    windowCents: number
    mrrCents: number
    firstHalfCents: number
    secondHalfCents: number
    arpuCents: number
    failedPayments: number
  }
  subscriptionsByPlan: Record<string, number>
  conversionRate: number
  ai: { lifetimeUsd: number; windowUsd: number; needsReview: number }
  series: {
    signups: Point[]
    revenueCents: Point[]
    activeUsers: Point[]
    aiSpendUsd: Point[]
  }
  health: { status: string; checks: { name: string; ok: boolean; latencyMs: number }[] }
  queues: { name: string; reachable: boolean; waiting: number; active: number; failed: number }[]
  content: { published: number; draft: number; stagingPending: number }
  expertReviews: { queued: number; assigned: number }
}

const WINDOWS = [7, 30, 90]

/**
 * The operator's first screen: is the business growing, is money arriving, and
 * is anything on fire. Everything above the fold answers one of those three;
 * the detail lives one click away on the section screens.
 */
export function OverviewDashboard() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<Metrics | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/metrics?days=${days}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load metrics')
        // Stamped with the window it answers, so a stale payload from the
        // previous range never renders under the new one's heading.
        setData({ ...body, windowDays: days })
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [days])

  if (error) {
    return <EmptyState title="Metrics unavailable" hint={error} />
  }
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    )
  }

  const signupDelta = change(data.users.signupsInWindow, data.users.signupsPreviousWindow)
  const revenueDelta = change(data.revenue.secondHalfCents, data.revenue.firstHalfCents)
  const planRows = ['free', 'paid', 'premium'].map((code, i) => ({
    label: code[0]!.toUpperCase() + code.slice(1),
    value: data.subscriptionsByPlan[code] ?? 0,
    tier: (i + 1) as 1 | 2 | 3,
  }))
  const queueBacklog = data.queues.reduce((a, q) => a + q.waiting + q.active, 0)
  const queueFailures = data.queues.reduce((a, q) => a + q.failed, 0)
  const unreachable = data.queues.filter((q) => !q.reachable)

  const alerts = [
    data.health.status !== 'ok' && {
      tone: 'critical' as const,
      text: `A dependency is failing: ${data.health.checks
        .filter((c) => !c.ok)
        .map((c) => c.name)
        .join(', ')}`,
      href: '/admin/system',
    },
    unreachable.length > 0 && {
      tone: 'critical' as const,
      text: `${unreachable.length} queue${unreachable.length > 1 ? 's' : ''} unreachable — the worker may be down`,
      href: '/admin/system',
    },
    data.revenue.failedPayments > 0 && {
      tone: 'warning' as const,
      text: `${data.revenue.failedPayments} failed payment${data.revenue.failedPayments > 1 ? 's' : ''} to review`,
      href: '/admin/billing',
    },
    data.ai.needsReview > 0 && {
      tone: 'warning' as const,
      text: `${data.ai.needsReview} evaluation${data.ai.needsReview > 1 ? 's' : ''} flagged for human review`,
      href: '/reviewer',
    },
    queueFailures > 0 && {
      tone: 'warning' as const,
      text: `${queueFailures} background job${queueFailures > 1 ? 's' : ''} failed`,
      href: '/admin/system',
    },
  ].filter(Boolean) as { tone: 'critical' | 'warning'; text: string; href: string }[]

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Business dashboard"
        lede={`Signups, revenue, model spend and operational health over the last ${data.windowDays} days.`}
        actions={
          <div
            className="inline-flex rounded-pill border border-line-strong bg-surface p-0.5"
            role="group"
            aria-label="Time range"
          >
            {WINDOWS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setDays(w)}
                aria-pressed={days === w}
                className={cn(
                  'rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors',
                  days === w ? 'bg-brand-600 text-white' : 'text-ink-muted hover:text-ink',
                )}
              >
                {w}d
              </button>
            ))}
          </div>
        }
      />

      {alerts.length > 0 && (
        <ul className="flex flex-col gap-2">
          {alerts.map((a) => (
            <li key={a.text}>
              <Link
                href={a.href}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors',
                  a.tone === 'critical'
                    ? 'border-flare-100 bg-flare-50 text-flare-700 hover:bg-flare-100 dark:border-flare-700 dark:bg-flare-700/20 dark:text-flare-100'
                    : 'border-brass-200 bg-brass-50 text-brass-800 hover:bg-brass-100 dark:border-brass-700 dark:bg-brass-900 dark:text-brass-100',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'size-1.5 shrink-0 rounded-full',
                      a.tone === 'critical' ? 'bg-flare-500' : 'bg-brass-500',
                    )}
                    aria-hidden="true"
                  />
                  {a.text}
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label={`Signups · ${data.windowDays}d`}
          value={compact(data.users.signupsInWindow)}
          delta={signupDelta}
          deltaLabel="vs previous period"
          trend={data.series.signups.map((p) => p.value)}
        />
        <StatTile
          label={`Revenue · ${data.windowDays}d`}
          value={money(data.revenue.windowCents)}
          delta={revenueDelta}
          deltaLabel="vs first half"
          trend={data.series.revenueCents.map((p) => p.value)}
          trendSlot={2}
        />
        <StatTile
          label="Active users · 7d"
          value={compact(data.users.activeUsers7d)}
          footnote={`${percent(data.users.activeUsers7d / Math.max(1, data.users.total))} of ${compact(data.users.total)} accounts`}
          trend={data.series.activeUsers.map((p) => p.value)}
        />
        <StatTile
          label={`AI spend · ${data.windowDays}d`}
          value={usd(data.ai.windowUsd)}
          upIsGood={false}
          footnote={`${usd(data.ai.lifetimeUsd)} lifetime`}
          trend={data.series.aiSpendUsd.map((p) => p.value)}
          trendSlot={2}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title="Growth"
          description="New accounts against the candidates who actually sat something."
          className="lg:col-span-2"
        >
          <TrendChart
            series={[
              { label: 'Signups', points: data.series.signups, slot: 1, area: true },
              { label: 'Active users', points: data.series.activeUsers, slot: 2 },
            ]}
            formatValue={compact}
          />
        </Section>

        <div className="flex flex-col gap-4">
          <Section title="Subscription book" description="Active subscriptions by plan.">
            <TierBars rows={planRows} formatValue={count} />
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
              <div>
                <dt className="text-xs text-ink-muted">Conversion</dt>
                <dd className="font-display font-semibold text-ink tabular-nums">
                  {percent(data.conversionRate)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">MRR</dt>
                <dd className="font-display font-semibold text-ink tabular-nums">
                  {money(data.revenue.mrrCents)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">ARPU</dt>
                <dd className="font-display font-semibold text-ink tabular-nums">
                  {money(data.revenue.arpuCents)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Verified</dt>
                <dd className="font-display font-semibold text-ink tabular-nums">
                  {percent(data.users.verified / Math.max(1, data.users.total), 0)}
                </dd>
              </div>
            </dl>
          </Section>

          <Section title="Operations">
            <ul className="flex flex-col gap-2.5 text-sm">
              <OpsRow
                label="Dependencies"
                value={data.health.status === 'ok' ? 'All healthy' : 'Degraded'}
                tone={data.health.status === 'ok' ? 'good' : 'critical'}
              />
              <OpsRow
                label="Queue backlog"
                value={`${count(queueBacklog)} job${queueBacklog === 1 ? '' : 's'}`}
                tone={unreachable.length ? 'critical' : queueBacklog > 100 ? 'warning' : 'good'}
              />
              <OpsRow
                label="Awaiting review"
                value={count(data.content.stagingPending)}
                tone={data.content.stagingPending > 0 ? 'warning' : 'neutral'}
              />
              <OpsRow
                label="Expert review queue"
                value={count(data.expertReviews.queued)}
                tone={data.expertReviews.queued > 0 ? 'warning' : 'neutral'}
              />
              <OpsRow
                label="Published questions"
                value={count(data.content.published)}
                tone="neutral"
              />
            </ul>
            <Link
              href="/admin/system"
              className="mt-4 inline-block text-sm font-medium text-brand-600 underline-offset-4 hover:underline dark:text-brand-300"
            >
              Open system panel →
            </Link>
          </Section>
        </div>
      </div>

      <Section
        title="Revenue"
        description="Payments captured per day, in the currency they were charged in."
      >
        <TrendChart
          series={[{ label: 'Revenue', points: data.series.revenueCents, slot: 2, area: true }]}
          formatValue={(n) => money(n)}
        />
      </Section>
    </div>
  )
}

function OpsRow({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'good' | 'warning' | 'critical' | 'neutral'
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <StatusPill tone={tone}>{value}</StatusPill>
    </li>
  )
}
