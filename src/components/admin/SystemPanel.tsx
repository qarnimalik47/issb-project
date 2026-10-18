'use client'

import { useEffect, useState } from 'react'
import {
  EmptyState,
  Field,
  Section,
  ScreenHeader,
  StatusPill,
  TableShell,
  Td,
  Th,
} from './ui/Primitives'
import { StatTile } from './charts/Figures'
import { bytes, count, dateTime, duration, relative } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Snapshot = {
  health: {
    status: string
    uptimeSeconds: number
    checks: { name: string; ok: boolean; latencyMs: number; error?: string }[]
  }
  queues: {
    name: string
    reachable: boolean
    waiting: number
    active: number
    delayed: number
    failed: number
    completed: number
  }[]
  storage: { bytes: number; files: number; path: string }
  backup: { lastAt: string | null; path: string }
  content: {
    published: number
    draft: number
    archived: number
    stagingPending: number
    stagingNeedsRewrite: number
  }
  expertReviews: { queued: number; assigned: number }
  evaluations: { last24h: number; failed: number; needsReview: number; p95LatencyMs: number }
  runtime: {
    appEnv: string
    nodeEnv: string
    nodeVersion: string
    uptimeSeconds: number
    memoryMb: number
  }
}

/**
 * The operational panel: is anything broken, and is work piling up. Polls
 * every thirty seconds — often enough to catch a stuck worker, rarely enough
 * that the queue counts are not themselves load.
 */
export function SystemPanel() {
  const [data, setData] = useState<Snapshot | null>(null)
  const [error, setError] = useState('')
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/system')
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load system state')
        setData(body)
        setFetchedAt(new Date())
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [tick])

  // Often enough to catch a stuck worker, rarely enough not to be load itself.
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  if (error && !data) return <EmptyState title="System state unavailable" hint={error} />
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    )
  }

  const backlog = data.queues.reduce((a, q) => a + q.waiting + q.active + q.delayed, 0)
  const failures = data.queues.reduce((a, q) => a + q.failed, 0)

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="System"
        lede="Dependency health, background work, storage and the content pipeline. Refreshes every 30 seconds."
        actions={
          <div className="flex items-center gap-3">
            {fetchedAt && (
              <span className="text-xs text-ink-muted">Updated {relative(fetchedAt)}</span>
            )}
            <Button variant="outline" size="sm" onClick={() => setTick((n) => n + 1)}>
              Refresh
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Service status"
          value={data.health.status === 'ok' ? 'Healthy' : 'Degraded'}
          footnote={`Up ${duration(data.runtime.uptimeSeconds)}`}
        />
        <StatTile
          label="Queue backlog"
          value={count(backlog)}
          upIsGood={false}
          footnote={`${count(failures)} failed jobs`}
        />
        <StatTile
          label="Evaluations · 24h"
          value={count(data.evaluations.last24h)}
          footnote={`p95 ${count(data.evaluations.p95LatencyMs)} ms`}
        />
        <StatTile
          label="Upload storage"
          value={bytes(data.storage.bytes)}
          footnote={`${count(data.storage.files)} files`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Dependencies" description="Checked live on every load of this screen.">
          <ul className="flex flex-col divide-y divide-line">
            {data.health.checks.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink capitalize">{c.name}</p>
                  {c.error && (
                    <p className="text-xs text-flare-600 dark:text-flare-100">{c.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-muted tabular-nums">{c.latencyMs} ms</span>
                  <StatusPill tone={c.ok ? 'good' : 'critical'}>
                    {c.ok ? 'Reachable' : 'Failing'}
                  </StatusPill>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Runtime">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Environment">
              <StatusPill tone={data.runtime.appEnv === 'production' ? 'critical' : 'neutral'}>
                {data.runtime.appEnv}
              </StatusPill>
            </Field>
            <Field label="Node build">{data.runtime.nodeEnv}</Field>
            <Field label="Node version">{data.runtime.nodeVersion}</Field>
            <Field label="Memory (RSS)">{data.runtime.memoryMb} MB</Field>
            <Field label="Uptime">{duration(data.runtime.uptimeSeconds)}</Field>
            <Field label="Last backup">
              {data.backup.lastAt ? dateTime(data.backup.lastAt) : 'No backup found'}
            </Field>
          </dl>
          {!data.backup.lastAt && (
            <p className="mt-3 text-xs text-brass-700 dark:text-brass-200">
              No backup directory at <code>{data.backup.path}</code>. Run{' '}
              <code>npm run backup</code> to create the first one.
            </p>
          )}
        </Section>
      </div>

      <Section
        title="Background queues"
        description="Slow work runs here, never inside a request. A queue that cannot be reached usually means the worker or Redis is down."
      >
        <TableShell>
          <thead>
            <tr>
              <Th>Queue</Th>
              <Th className="text-right">Waiting</Th>
              <Th className="text-right">Active</Th>
              <Th className="text-right">Delayed</Th>
              <Th className="text-right">Failed</Th>
              <Th className="text-right">Completed</Th>
              <Th>State</Th>
            </tr>
          </thead>
          <tbody>
            {data.queues.map((q) => (
              <tr key={q.name}>
                <Td className="font-medium text-ink">{q.name}</Td>
                <Td className="text-right tabular-nums">{count(q.waiting)}</Td>
                <Td className="text-right tabular-nums">{count(q.active)}</Td>
                <Td className="text-right text-ink-muted tabular-nums">{count(q.delayed)}</Td>
                <Td
                  className={cn(
                    'text-right tabular-nums',
                    q.failed > 0 && 'font-medium text-flare-600 dark:text-flare-100',
                  )}
                >
                  {count(q.failed)}
                </Td>
                <Td className="text-right text-ink-muted tabular-nums">{count(q.completed)}</Td>
                <Td>
                  <StatusPill tone={q.reachable ? 'good' : 'critical'}>
                    {q.reachable ? 'Reachable' : 'Unreachable'}
                  </StatusPill>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Content pipeline">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Published">{count(data.content.published)}</Field>
            <Field label="Draft">{count(data.content.draft)}</Field>
            <Field label="Archived">{count(data.content.archived)}</Field>
            <Field label="Awaiting review">{count(data.content.stagingPending)}</Field>
            <Field label="Needs rewrite">{count(data.content.stagingNeedsRewrite)}</Field>
          </dl>
        </Section>

        <Section title="Evaluation & review backlog">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Failed (24h)">{count(data.evaluations.failed)}</Field>
            <Field label="Needs review">{count(data.evaluations.needsReview)}</Field>
            <Field label="p95 latency">{count(data.evaluations.p95LatencyMs)} ms</Field>
            <Field label="Expert queue">{count(data.expertReviews.queued)}</Field>
            <Field label="Assigned">{count(data.expertReviews.assigned)}</Field>
          </dl>
        </Section>
      </div>
    </div>
  )
}
