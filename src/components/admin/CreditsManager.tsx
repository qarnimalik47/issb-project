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
  inputClass,
  selectClass,
} from './ui/Primitives'
import { StatTile } from './charts/Figures'
import { count, dateTime, relative } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Payload = {
  stats: {
    outstanding: number
    lifetimeGranted: number
    lifetimeSpent: number
    issued30d: number
    consumed30d: number
    holders: number
  }
  ledger: {
    id: string
    userId: string
    userName: string
    userEmail: string
    delta: number
    balanceAfter: number
    kind: string
    reason: string
    createdAt: string
  }[]
  balances: {
    userId: string
    name: string
    email: string
    balance: number
    lifetimeGranted: number
    lifetimeSpent: number
    updatedAt: string
  }[]
}

const KINDS = ['', 'grant', 'spend', 'refund', 'adjustment', 'purchase', 'plan_renewal'] as const

/**
 * The credit ledger. Credits are the overflow above a plan's daily allowance,
 * so this screen answers two questions: how much unspent liability is on the
 * books, and who has it.
 */
export function CreditsManager() {
  const [data, setData] = useState<Payload | null>(null)
  const [kind, setKind] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/credits${kind ? `?kind=${kind}` : ''}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load credits')
        setData(body)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [kind, tick])

  if (error) return <EmptyState title="Credits unavailable" hint={error} />
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Credits"
        lede="One credit buys one AI evaluation once a candidate's daily plan allowance is used up. Grants, deductions and spend are all recorded here."
      />

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Outstanding balance"
          value={count(data.stats.outstanding)}
          footnote={`Held by ${count(data.stats.holders)} accounts`}
        />
        <StatTile
          label="Issued · 30d"
          value={count(data.stats.issued30d)}
          footnote={`${count(data.stats.lifetimeGranted)} lifetime`}
        />
        <StatTile
          label="Consumed · 30d"
          value={count(data.stats.consumed30d)}
          footnote={`${count(data.stats.lifetimeSpent)} lifetime`}
        />
        <StatTile
          label="Burn rate"
          value={`${(data.stats.consumed30d / 30).toFixed(1)}/day`}
          footnote="Average over the last 30 days"
        />
      </div>

      <GrantPanel
        onDone={(text) => {
          setMessage({ tone: 'good', text })
          setTick((n) => n + 1)
        }}
        onError={(text) => setMessage({ tone: 'critical', text })}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Section
          title="Largest balances"
          description="Who is holding unspent credit."
          className="lg:col-span-2"
        >
          {data.balances.length === 0 ? (
            <EmptyState title="No credit accounts yet" hint="Grant credits to create one." />
          ) : (
            <ul className="flex flex-col divide-y divide-line">
              {data.balances.map((b) => (
                <li key={b.userId} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{b.name}</p>
                    <p className="truncate text-xs text-ink-muted">{b.email}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-sm font-semibold text-ink tabular-nums">
                      {count(b.balance)}
                    </p>
                    <p className="text-xs text-ink-muted">{relative(b.updatedAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Ledger"
          description="Every credit movement, newest first."
          className="lg:col-span-3"
          actions={
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              aria-label="Filter by movement type"
              className={selectClass}
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k === '' ? 'All movements' : k.replace('_', ' ')}
                </option>
              ))}
            </select>
          }
        >
          {data.ledger.length === 0 ? (
            <EmptyState title="Nothing recorded" hint="No credit movements match this filter." />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Account</Th>
                  <Th>Reason</Th>
                  <Th>Type</Th>
                  <Th className="text-right">Change</Th>
                  <Th className="text-right">Balance</Th>
                  <Th className="text-right">When</Th>
                </tr>
              </thead>
              <tbody>
                {data.ledger.map((l) => (
                  <tr key={l.id}>
                    <Td>
                      <span className="block text-ink">{l.userName}</span>
                      <span className="block text-xs text-ink-muted">{l.userEmail}</span>
                    </Td>
                    <Td className="text-ink-muted">{l.reason}</Td>
                    <Td>
                      <StatusPill tone={l.delta > 0 ? 'good' : 'neutral'} dot={false}>
                        {l.kind.replace('_', ' ')}
                      </StatusPill>
                    </Td>
                    <Td
                      className={cn(
                        'text-right font-semibold tabular-nums',
                        l.delta > 0
                          ? 'text-brand-600 dark:text-brand-300'
                          : 'text-flare-600 dark:text-flare-100',
                      )}
                    >
                      {l.delta > 0 ? '+' : ''}
                      {l.delta}
                    </Td>
                    <Td className="text-right text-ink-muted tabular-nums">{l.balanceAfter}</Td>
                    <Td className="text-right text-xs text-ink-muted">{dateTime(l.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </Section>
      </div>
    </div>
  )
}

type Audience = 'emails' | 'plan'

function GrantPanel({
  onDone,
  onError,
}: {
  onDone: (text: string) => void
  onError: (text: string) => void
}) {
  const [audience, setAudience] = useState<Audience>('emails')
  const [emails, setEmails] = useState('')
  const [planCode, setPlanCode] = useState('paid')
  const [amount, setAmount] = useState('50')
  const [reason, setReason] = useState('Goodwill credit')
  const [busy, setBusy] = useState(false)

  const parsed = Number(amount)
  const list = emails
    .split(/[\s,;]+/)
    .map((e) => e.trim())
    .filter(Boolean)
  const valid =
    Number.isInteger(parsed) &&
    parsed !== 0 &&
    reason.trim().length > 0 &&
    (audience === 'plan' || list.length > 0)

  async function submit() {
    setBusy(true)
    try {
      const target =
        audience === 'plan' ? { kind: 'plan', planCode } : { kind: 'emails', emails: list }
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: parsed, reason: reason.trim(), target }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'The grant failed')
      const unmatched: string[] = body.unmatched ?? []
      onDone(
        `${parsed > 0 ? 'Granted' : 'Deducted'} ${Math.abs(parsed)} credits across ${body.accounts} account${
          body.accounts === 1 ? '' : 's'
        }.${unmatched.length ? ` No account for: ${unmatched.join(', ')}.` : ''}`,
      )
      if (audience === 'emails') setEmails('')
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Section
      title="Issue credits"
      description="Grant or deduct in bulk. A positive amount tops accounts up; a negative one removes credit, never below zero."
    >
      <div className="flex flex-col gap-4">
        <div
          className="inline-flex w-fit rounded-pill border border-line-strong bg-surface p-0.5"
          role="group"
          aria-label="Audience"
        >
          {(
            [
              ['emails', 'By email'],
              ['plan', 'Everyone on a plan'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setAudience(value)}
              aria-pressed={audience === value}
              className={cn(
                'rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors',
                audience === value ? 'bg-brand-600 text-white' : 'text-ink-muted hover:text-ink',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {audience === 'emails' ? (
          <div>
            <label htmlFor="grant-emails" className="block text-xs font-semibold text-ink-muted">
              Email addresses
            </label>
            <textarea
              id="grant-emails"
              rows={3}
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="one@example.com, two@example.com"
              className={cn(inputClass, 'mt-1')}
            />
            <p className="mt-1 text-xs text-ink-muted">
              {list.length} address{list.length === 1 ? '' : 'es'} · separated by commas, spaces or
              new lines. Addresses with no account are reported back and skipped.
            </p>
          </div>
        ) : (
          <div>
            <label htmlFor="grant-plan" className="block text-xs font-semibold text-ink-muted">
              Plan
            </label>
            <select
              id="grant-plan"
              value={planCode}
              onChange={(e) => setPlanCode(e.target.value)}
              className={cn(selectClass, 'mt-1')}
            >
              <option value="free">Free</option>
              <option value="paid">Paid</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="grant-amount" className="block text-xs font-semibold text-ink-muted">
              Credits per account
            </label>
            <input
              id="grant-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(inputClass, 'mt-1 w-32')}
            />
          </div>
          <div className="min-w-[14rem] flex-1">
            <label htmlFor="grant-reason" className="block text-xs font-semibold text-ink-muted">
              Reason (appears in the ledger)
            </label>
            <input
              id="grant-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={cn(inputClass, 'mt-1')}
            />
          </div>
          <Button disabled={busy || !valid} onClick={submit}>
            {busy ? 'Working…' : parsed < 0 ? 'Deduct credits' : 'Grant credits'}
          </Button>
        </div>
      </div>
    </Section>
  )
}
