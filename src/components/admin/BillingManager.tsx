'use client'

import { useEffect, useState } from 'react'
import {
  EmptyState,
  Notice,
  Section,
  ScreenHeader,
  StatusPill,
  TableShell,
  Td,
  Th,
} from './ui/Primitives'
import { StatTile, TierBars } from './charts/Figures'
import { TrendChart } from './charts/TrendChart'
import { count, dateTime, money, percent } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Overview = {
  windowDays: number
  totals: {
    grossCents: number
    refundedCents: number
    netCents: number
    paidCount: number
    refundedCount: number
    failedCount: number
    pendingCount: number
    successRate: number
    creditsPurchased: number
  }
  byGateway: { gateway: string; n: number; paidCents: number; failures: number }[]
  subscriptionBook: { plan: string; status: string; n: number }[]
  plans: {
    code: string
    nameEn: string
    priceCents: number
    currency: string
    entitlements: {
      aiEvaluationsPerDay: number
      mockInterviewsPerMonth: number
      expertReviewsPerMonth: number
      monthlyCredits: number
      unlimitedMcq: boolean
    }
    activeCount: number
  }[]
  payments: {
    id: string
    userId: string
    userName: string
    userEmail: string
    gateway: string
    planCode: string
    amountCents: number
    currency: string
    status: string
    gatewayRef: string
    createdAt: string
    paidAt: string | null
  }[]
  invoices: {
    id: string
    number: string
    userName: string
    userEmail: string
    planCode: string
    amountCents: number
    currency: string
    issuedAt: string
  }[]
  revenueSeriesCents: { date: string; value: number }[]
}

const WINDOWS = [7, 30, 90]
const STATUS_FILTERS = ['all', 'paid', 'pending', 'failed', 'refunded'] as const

function paymentTone(status: string) {
  if (status === 'paid') return 'good' as const
  if (status === 'failed') return 'critical' as const
  if (status === 'refunded') return 'warning' as const
  return 'neutral' as const
}

/**
 * Money in, money back, and what the subscription book is worth. Refunds are
 * issued from here rather than from the user drawer when support is working
 * from a payment rather than from a person.
 */
export function BillingManager() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('all')
  const [busy, setBusy] = useState('')
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/billing?days=${days}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load billing')
        setData(body)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [days, tick])

  async function refund(paymentId: string) {
    setBusy(paymentId)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/billing', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'refund', paymentId }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'Refund failed')
      setMessage({ tone: 'good', text: 'Payment refunded and the subscription cancelled.' })
      setTick((n) => n + 1)
    } catch (e) {
      setMessage({ tone: 'critical', text: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  if (error) return <EmptyState title="Billing unavailable" hint={error} />
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    )
  }

  const payments =
    filter === 'all' ? data.payments : data.payments.filter((p) => p.status === filter)

  const bookRows = ['free', 'paid', 'premium'].map((code, i) => ({
    label: code[0]!.toUpperCase() + code.slice(1),
    value: data.subscriptionBook
      .filter((r) => r.plan === code && r.status === 'active')
      .reduce((a, b) => a + b.n, 0),
    tier: (i + 1) as 1 | 2 | 3,
  }))

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Billing"
        lede="Receipts, refunds and the state of the subscription book. Amounts are shown in the currency each payment was charged in."
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

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Gross collected"
          value={money(data.totals.grossCents)}
          footnote={`${count(data.totals.paidCount)} successful payments`}
        />
        <StatTile
          label="Net after refunds"
          value={money(data.totals.netCents)}
          footnote={`${money(data.totals.refundedCents)} refunded`}
        />
        <StatTile
          label="Checkout success"
          value={percent(data.totals.successRate, 1)}
          footnote={`${count(data.totals.failedCount)} failed · ${count(data.totals.pendingCount)} pending`}
        />
        <StatTile
          label="Credits purchased"
          value={count(data.totals.creditsPurchased)}
          footnote={`Last ${data.windowDays} days`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section
          title="Revenue"
          description={`Payments captured per day over the last ${data.windowDays} days.`}
          className="lg:col-span-2"
        >
          <TrendChart
            series={[{ label: 'Revenue', points: data.revenueSeriesCents, slot: 2, area: true }]}
            formatValue={(n) => money(n)}
          />
        </Section>

        <div className="flex flex-col gap-4">
          <Section title="Active subscriptions">
            <TierBars rows={bookRows} formatValue={count} />
          </Section>
          <Section title="Gateways" description={`Activity in the last ${data.windowDays} days.`}>
            {data.byGateway.length === 0 ? (
              <p className="text-sm text-ink-muted">No gateway activity in this window.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-line text-sm">
                {data.byGateway.map((g) => (
                  <li key={g.gateway} className="flex items-center justify-between gap-3 py-2">
                    <span className="font-medium text-ink capitalize">{g.gateway}</span>
                    <span className="text-right text-ink-muted tabular-nums">
                      {money(g.paidCents)}
                      {g.failures > 0 && (
                        <span className="ml-2 text-flare-600 dark:text-flare-100">
                          {g.failures} failed
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </div>

      <Section
        title="Plans"
        description="Pricing and entitlements as the application enforces them."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {data.plans.map((plan) => (
            <div key={plan.code} className="rounded-card border border-line bg-sunk/40 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-sm font-bold text-ink">{plan.nameEn}</h3>
                <StatusPill tone="neutral" dot={false}>
                  {count(plan.activeCount)} active
                </StatusPill>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-ink tabular-nums">
                {plan.priceCents > 0 ? money(plan.priceCents, plan.currency) : 'Free'}
                {plan.priceCents > 0 && (
                  <span className="text-sm font-normal text-ink-muted"> / month</span>
                )}
              </p>
              {plan.priceCents === 0 && plan.code !== 'free' && (
                <p className="mt-1 text-xs text-brass-700 dark:text-brass-200">
                  Price not set yet — checkout will charge nothing.
                </p>
              )}
              <ul className="mt-3 flex flex-col gap-1 text-xs text-ink-muted">
                <li>{plan.entitlements.aiEvaluationsPerDay} AI evaluations per day</li>
                <li>{plan.entitlements.monthlyCredits} credits on renewal</li>
                <li>{plan.entitlements.mockInterviewsPerMonth} mock interviews per month</li>
                <li>{plan.entitlements.expertReviewsPerMonth} expert reviews per month</li>
                <li>{plan.entitlements.unlimitedMcq ? 'Unlimited MCQ practice' : 'Limited MCQ'}</li>
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Payments"
        description="The 50 most recent payments across all gateways."
        actions={
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                aria-pressed={filter === s}
                className={cn(
                  'rounded-pill px-3 py-1 text-xs font-medium capitalize transition-colors',
                  filter === s
                    ? 'bg-brand-600 text-white'
                    : 'border border-line text-ink-muted hover:bg-sunk',
                )}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        {payments.length === 0 ? (
          <EmptyState title="No payments" hint="Nothing matches this filter yet." />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Candidate</Th>
                <Th>Plan</Th>
                <Th>Gateway</Th>
                <Th className="text-right">Amount</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <span className="block font-medium text-ink">{p.userName}</span>
                    <span className="block text-xs text-ink-muted">{p.userEmail}</span>
                  </Td>
                  <Td className="text-ink-muted capitalize">{p.planCode}</Td>
                  <Td className="text-ink-muted capitalize">{p.gateway}</Td>
                  <Td className="text-right font-medium tabular-nums">
                    {money(p.amountCents, p.currency)}
                  </Td>
                  <Td>
                    <StatusPill tone={paymentTone(p.status)}>{p.status}</StatusPill>
                  </Td>
                  <Td className="text-xs text-ink-muted">{dateTime(p.createdAt)}</Td>
                  <Td className="text-right">
                    {p.status === 'paid' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === p.id}
                        onClick={() => refund(p.id)}
                      >
                        {busy === p.id ? 'Refunding…' : 'Refund'}
                      </Button>
                    ) : (
                      <span className="text-xs text-ink-muted">—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>

      <Section title="Invoices" description="Issued automatically whenever a payment is applied.">
        {data.invoices.length === 0 ? (
          <EmptyState title="No invoices yet" hint="An invoice is created with each paid charge." />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Number</Th>
                <Th>Candidate</Th>
                <Th>Plan</Th>
                <Th className="text-right">Amount</Th>
                <Th className="text-right">Issued</Th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((inv) => (
                <tr key={inv.id}>
                  <Td>
                    <code className="text-xs text-ink">{inv.number}</code>
                  </Td>
                  <Td>
                    <span className="block text-ink">{inv.userName}</span>
                    <span className="block text-xs text-ink-muted">{inv.userEmail}</span>
                  </Td>
                  <Td className="text-ink-muted capitalize">{inv.planCode}</Td>
                  <Td className="text-right tabular-nums">
                    {money(inv.amountCents, inv.currency)}
                  </Td>
                  <Td className="text-right text-xs text-ink-muted">{dateTime(inv.issuedAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>
    </div>
  )
}
