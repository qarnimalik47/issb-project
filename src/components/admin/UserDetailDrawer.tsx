'use client'

import { useCallback, useEffect, useState } from 'react'
import { Field, Notice, StatusPill, inputClass, selectClass } from './ui/Primitives'
import { PLAN_LABELS, ROLE_LABELS, statusTone } from './UsersManager'
import { count, date, dateTime, money, relative, usd } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Profile = {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    role: string
    status: string
    locale: string
    courseTrack: string | null
    targetIssbDate: string | null
    emailVerifiedAt: string | null
    phoneVerifiedAt: string | null
    lockedUntil: string | null
    failedLoginCount: number
    createdAt: string
  }
  subscription: {
    planCode: string
    status: string
    currentPeriodEnd: string | null
    graceUntil: string | null
  } | null
  notes: { id: string; note: string; createdAt: string; authorName: string | null }[]
  payments: {
    id: string
    gateway: string
    planCode: string
    amountCents: number
    currency: string
    status: string
    createdAt: string
  }[]
  credits: { balance: number; lifetimeGranted: number; lifetimeSpent: number }
  ledger: {
    id: string
    delta: number
    balanceAfter: number
    kind: string
    reason: string
    createdAt: string
  }[]
  sessions: { id: string; ip: string | null; userAgent: string | null; createdAt: string }[]
  stats: {
    attempts: number
    lastActiveAt: string | null
    evaluations: number
    aiCostUsd: number
    lifetimeSpendCents: number
  }
}

type Tab = 'overview' | 'billing' | 'credits' | 'security' | 'notes'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'billing', label: 'Billing' },
  { id: 'credits', label: 'Credits' },
  { id: 'security', label: 'Security' },
  { id: 'notes', label: 'Notes' },
]

/**
 * One account, everything support can do to it.
 *
 * A slide-over rather than a page: the operator keeps the filtered roster
 * behind it, so working through a list of accounts does not mean navigating
 * back and re-applying filters each time.
 */
export function UserDetailDrawer({
  userId,
  isSelf,
  onClose,
  onChanged,
}: {
  userId: string
  /** The signed-in admin's own account: role and suspension are withheld. */
  isSelf: boolean
  onClose: () => void
  onChanged: () => void
}) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)

  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/users/${userId}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load account')
        setProfile(body)
      })
      .catch((e: Error) => !cancelled && setMessage({ tone: 'critical', text: e.message }))
    return () => {
      cancelled = true
    }
  }, [userId, tick])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const act = useCallback(
    async (payload: Record<string, unknown>, success: string) => {
      setBusy(true)
      setMessage(null)
      try {
        const res = await fetch(`/api/admin/users/${userId}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body?.error?.message ?? 'That action failed')
        setMessage({ tone: 'good', text: success })
        setTick((n) => n + 1)
        onChanged()
      } catch (e) {
        setMessage({ tone: 'critical', text: (e as Error).message })
      } finally {
        setBusy(false)
      }
    },
    [userId, onChanged],
  )

  const u = profile?.user

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-brand-950/45 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Account detail"
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-canvas shadow-raised"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4">
          <div className="min-w-0">
            {u ? (
              <>
                <p className="truncate font-display text-lg font-bold tracking-tight text-ink">
                  {u.name}
                </p>
                <p className="truncate text-sm text-ink-muted">{u.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusPill tone={statusTone(u.status)}>{u.status}</StatusPill>
                  <StatusPill tone="neutral" dot={false}>
                    {ROLE_LABELS[u.role] ?? u.role}
                  </StatusPill>
                  <StatusPill
                    tone={profile?.subscription?.planCode === 'free' ? 'neutral' : 'good'}
                    dot={false}
                  >
                    {PLAN_LABELS[profile?.subscription?.planCode ?? 'free'] ?? 'Free'}
                  </StatusPill>
                  {!u.emailVerifiedAt && <StatusPill tone="warning">Email unverified</StatusPill>}
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-muted">Loading account…</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={cn(
                '-mb-px border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                tab === t.id
                  ? 'border-brass-500 text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {message && (
            <div className="mb-4">
              <Notice tone={message.tone}>{message.text}</Notice>
            </div>
          )}

          {profile && u && (
            <>
              {tab === 'overview' && (
                <div className="flex flex-col gap-5">
                  <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Field label="Attempts">{count(profile.stats.attempts)}</Field>
                    <Field label="Last active">{relative(profile.stats.lastActiveAt)}</Field>
                    <Field label="Evaluations">{count(profile.stats.evaluations)}</Field>
                    <Field label="AI cost">{usd(profile.stats.aiCostUsd)}</Field>
                    <Field label="Lifetime spend">{money(profile.stats.lifetimeSpendCents)}</Field>
                    <Field label="Credits">{count(profile.credits.balance)}</Field>
                    <Field label="Phone">{u.phone ?? '—'}</Field>
                    <Field label="Track">{u.courseTrack ?? '—'}</Field>
                    <Field label="Target ISSB">{date(u.targetIssbDate)}</Field>
                    <Field label="Language">{u.locale === 'ur' ? 'Urdu' : 'English'}</Field>
                    <Field label="Registered">{dateTime(u.createdAt)}</Field>
                    <Field label="Email verified">
                      {u.emailVerifiedAt ? dateTime(u.emailVerifiedAt) : 'No'}
                    </Field>
                  </dl>

                  <Panel title="Role">
                    {isSelf ? (
                      <p className="text-sm text-ink-muted">
                        You cannot change your own role. Ask another administrator.
                      </p>
                    ) : (
                      <RoleForm
                        key={u.role}
                        current={u.role}
                        busy={busy}
                        onSubmit={(role) => act({ action: 'role', role }, `Role set to ${role}.`)}
                      />
                    )}
                  </Panel>

                  <Panel title="Account state">
                    {isSelf && u.status === 'active' && !u.lockedUntil && (
                      <p className="text-sm text-ink-muted">
                        This is your own account — it cannot be suspended from here.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {u.status !== 'active' && (
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() =>
                            act({ action: 'status', status: 'active' }, 'Account restored.')
                          }
                        >
                          Restore account
                        </Button>
                      )}
                      {u.status === 'active' && !isSelf && (
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={busy}
                          onClick={() =>
                            act(
                              { action: 'status', status: 'locked' },
                              'Account suspended and sessions revoked.',
                            )
                          }
                        >
                          Suspend account
                        </Button>
                      )}
                      {(u.lockedUntil || u.failedLoginCount > 0) && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() => act({ action: 'unlock' }, 'Sign-in lockout cleared.')}
                        >
                          Clear sign-in lockout
                        </Button>
                      )}
                    </div>
                    {u.lockedUntil && (
                      <p className="mt-2 text-xs text-ink-muted">
                        Locked out of sign-in until {dateTime(u.lockedUntil)} after{' '}
                        {u.failedLoginCount} failed attempts.
                      </p>
                    )}
                  </Panel>
                </div>
              )}

              {tab === 'billing' && (
                <div className="flex flex-col gap-5">
                  <Panel title="Subscription">
                    {profile.subscription ? (
                      <dl className="grid grid-cols-2 gap-4">
                        <Field label="Plan">
                          {PLAN_LABELS[profile.subscription.planCode] ??
                            profile.subscription.planCode}
                        </Field>
                        <Field label="Status">{profile.subscription.status}</Field>
                        <Field label="Renews">{date(profile.subscription.currentPeriodEnd)}</Field>
                        <Field label="Grace until">{date(profile.subscription.graceUntil)}</Field>
                      </dl>
                    ) : (
                      <p className="text-sm text-ink-muted">
                        No subscription record — this account is on the free plan.
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(['free', 'paid', 'premium'] as const).map((planCode) => (
                        <Button
                          key={planCode}
                          size="sm"
                          variant={
                            profile.subscription?.planCode === planCode ? 'primary' : 'outline'
                          }
                          disabled={busy}
                          onClick={() =>
                            act(
                              { action: 'grant', planCode },
                              `${PLAN_LABELS[planCode]} plan granted for 30 days.`,
                            )
                          }
                        >
                          Grant {PLAN_LABELS[planCode]}
                        </Button>
                      ))}
                    </div>
                  </Panel>

                  <Panel title="Payments">
                    {profile.payments.length === 0 ? (
                      <p className="text-sm text-ink-muted">No payments recorded.</p>
                    ) : (
                      <ul className="flex flex-col divide-y divide-line">
                        {profile.payments.map((p) => (
                          <li
                            key={p.id}
                            className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-ink">
                                {money(p.amountCents, p.currency)}{' '}
                                <span className="font-normal text-ink-muted">
                                  · {PLAN_LABELS[p.planCode] ?? p.planCode} · {p.gateway}
                                </span>
                              </p>
                              <p className="text-xs text-ink-muted">{dateTime(p.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusPill
                                tone={
                                  p.status === 'paid'
                                    ? 'good'
                                    : p.status === 'failed'
                                      ? 'critical'
                                      : p.status === 'refunded'
                                        ? 'warning'
                                        : 'neutral'
                                }
                              >
                                {p.status}
                              </StatusPill>
                              {p.status === 'paid' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={busy}
                                  onClick={() =>
                                    act(
                                      { action: 'refund', paymentId: p.id },
                                      'Payment refunded and the subscription cancelled.',
                                    )
                                  }
                                >
                                  Refund
                                </Button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>
              )}

              {tab === 'credits' && (
                <div className="flex flex-col gap-5">
                  <dl className="grid grid-cols-3 gap-4">
                    <Field label="Balance">
                      <span className="font-display text-xl font-bold text-ink">
                        {count(profile.credits.balance)}
                      </span>
                    </Field>
                    <Field label="Granted">{count(profile.credits.lifetimeGranted)}</Field>
                    <Field label="Spent">{count(profile.credits.lifetimeSpent)}</Field>
                  </dl>

                  <Panel title="Adjust balance">
                    <CreditForm
                      busy={busy}
                      onSubmit={(delta, reason) =>
                        act(
                          { action: 'credits', delta, reason },
                          `${delta > 0 ? 'Added' : 'Deducted'} ${Math.abs(delta)} credits.`,
                        )
                      }
                    />
                  </Panel>

                  <Panel title="Ledger">
                    {profile.ledger.length === 0 ? (
                      <p className="text-sm text-ink-muted">No credit movements yet.</p>
                    ) : (
                      <ul className="flex flex-col divide-y divide-line">
                        {profile.ledger.map((l) => (
                          <li key={l.id} className="flex items-center justify-between gap-3 py-2.5">
                            <div className="min-w-0">
                              <p className="truncate text-sm text-ink">{l.reason}</p>
                              <p className="text-xs text-ink-muted">
                                {l.kind} · {dateTime(l.createdAt)}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p
                                className={cn(
                                  'font-display text-sm font-semibold tabular-nums',
                                  l.delta > 0
                                    ? 'text-brand-600 dark:text-brand-300'
                                    : 'text-flare-600 dark:text-flare-100',
                                )}
                              >
                                {l.delta > 0 ? '+' : ''}
                                {l.delta}
                              </p>
                              <p className="text-xs text-ink-muted tabular-nums">
                                → {l.balanceAfter}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>
              )}

              {tab === 'security' && (
                <div className="flex flex-col gap-5">
                  <Panel
                    title="Active sessions"
                    action={
                      profile.sessions.length > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy}
                          onClick={() =>
                            act({ action: 'revoke_sessions' }, 'All sessions signed out.')
                          }
                        >
                          Sign out everywhere
                        </Button>
                      ) : null
                    }
                  >
                    {profile.sessions.length === 0 ? (
                      <p className="text-sm text-ink-muted">No active sessions.</p>
                    ) : (
                      <ul className="flex flex-col divide-y divide-line">
                        {profile.sessions.map((s) => (
                          <li key={s.id} className="py-2.5">
                            <p className="text-sm text-ink">{s.ip ?? 'unknown IP'}</p>
                            <p className="truncate text-xs text-ink-muted">
                              {s.userAgent ?? 'unknown device'} · started {relative(s.createdAt)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>

                  <Panel title="Sign-in">
                    <dl className="grid grid-cols-2 gap-4">
                      <Field label="Failed attempts">{u.failedLoginCount}</Field>
                      <Field label="Locked until">
                        {u.lockedUntil ? dateTime(u.lockedUntil) : 'Not locked'}
                      </Field>
                      <Field label="Phone verified">
                        {u.phoneVerifiedAt ? dateTime(u.phoneVerifiedAt) : 'No'}
                      </Field>
                      <Field label="Account id">
                        <code className="text-xs break-all text-ink-muted">{u.id}</code>
                      </Field>
                    </dl>
                  </Panel>
                </div>
              )}

              {tab === 'notes' && (
                <div className="flex flex-col gap-5">
                  <Panel title="Add a support note">
                    <NoteForm
                      busy={busy}
                      onSubmit={(note) => act({ action: 'note', note }, 'Note saved.')}
                    />
                  </Panel>
                  <Panel title="History">
                    {profile.notes.length === 0 ? (
                      <p className="text-sm text-ink-muted">No notes on this account.</p>
                    ) : (
                      <ul className="flex flex-col divide-y divide-line">
                        {profile.notes.map((n) => (
                          <li key={n.id} className="py-3">
                            <p className="text-sm whitespace-pre-wrap text-ink">{n.note}</p>
                            <p className="mt-1 text-xs text-ink-muted">
                              {n.authorName ?? 'System'} · {dateTime(n.createdAt)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Panel({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function RoleForm({
  current,
  busy,
  onSubmit,
}: {
  current: string
  busy: boolean
  onSubmit: (role: string) => void
}) {
  const [role, setRole] = useState(current)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        aria-label="Role"
        className={selectClass}
      >
        {Object.entries(ROLE_LABELS).map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <Button size="sm" disabled={busy || role === current} onClick={() => onSubmit(role)}>
        Update role
      </Button>
    </div>
  )
}

function CreditForm({
  busy,
  onSubmit,
}: {
  busy: boolean
  onSubmit: (delta: number, reason: string) => void
}) {
  const [amount, setAmount] = useState('50')
  const [reason, setReason] = useState('Goodwill credit')
  const parsed = Number(amount)
  const valid = Number.isInteger(parsed) && parsed !== 0 && reason.trim().length > 0

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="credit-amount" className="block text-xs font-semibold text-ink-muted">
            Amount
          </label>
          <input
            id="credit-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(inputClass, 'mt-1 w-28')}
          />
        </div>
        <div className="min-w-[12rem] flex-1">
          <label htmlFor="credit-reason" className="block text-xs font-semibold text-ink-muted">
            Reason
          </label>
          <input
            id="credit-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={cn(inputClass, 'mt-1')}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={busy || !valid}
          onClick={() => onSubmit(Math.abs(parsed), reason.trim())}
        >
          Add credits
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={busy || !valid}
          onClick={() => onSubmit(-Math.abs(parsed), reason.trim())}
        >
          Deduct credits
        </Button>
      </div>
      <p className="text-xs text-ink-muted">
        Credits are spent on AI evaluation once the plan&rsquo;s daily allowance runs out. Every
        movement is recorded in the ledger against your account.
      </p>
    </div>
  )
}

function NoteForm({ busy, onSubmit }: { busy: boolean; onSubmit: (note: string) => void }) {
  const [note, setNote] = useState('')
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="What happened, and what you did about it."
        aria-label="Support note"
        className={inputClass}
      />
      <div>
        <Button
          size="sm"
          disabled={busy || note.trim().length === 0}
          onClick={() => {
            onSubmit(note.trim())
            setNote('')
          }}
        >
          Save note
        </Button>
      </div>
    </div>
  )
}
