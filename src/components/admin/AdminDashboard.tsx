'use client'

import { useEffect, useState } from 'react'

type Metrics = {
  signups: number
  activeUsers7d: number
  subscriptionsByPlan: Record<string, number>
  conversionRate: number
  aiSpendUsd: number
  failedPayments: number
  evaluationsNeedingReview: number
  queueDepth: Record<string, number>
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  )
}

export function AdminDashboard() {
  const [m, setM] = useState<Metrics | null>(null)

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((r) => r.json())
      .then(setM)
      .catch(() => {})
  }, [])

  if (!m) return <p className="text-ink-muted">Loading metrics…</p>

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Signups" value={m.signups} />
        <Stat label="Active users (7d)" value={m.activeUsers7d} />
        <Stat label="Conversion" value={`${(m.conversionRate * 100).toFixed(1)}%`} />
        <Stat label="AI spend (USD)" value={`$${m.aiSpendUsd}`} />
        <Stat label="Failed payments" value={m.failedPayments} />
        <Stat label="Evals needing review" value={m.evaluationsNeedingReview} />
      </div>
      <div className="rounded-lg border border-line p-4 text-sm">
        <div className="font-medium">Subscriptions by plan</div>
        <div className="mt-1 text-ink-muted">
          {Object.entries(m.subscriptionsByPlan)
            .map(([p, n]) => `${p}: ${n}`)
            .join(' · ') || 'none'}
        </div>
        <div className="mt-3 font-medium">Queue depth</div>
        <div className="mt-1 text-ink-muted">
          {Object.entries(m.queueDepth)
            .map(([q, n]) => `${q}: ${n}`)
            .join(' · ')}
        </div>
      </div>
    </div>
  )
}
