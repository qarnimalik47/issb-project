'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  EmptyState,
  Section,
  ScreenHeader,
  StatusPill,
  TableShell,
  Td,
  Th,
  inputClass,
  selectClass,
} from './ui/Primitives'
import { UserDetailDrawer } from './UserDetailDrawer'
import { compact, count, dateTime, money, relative } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

export type UserRow = {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  emailVerified: boolean
  planCode: string
  subscriptionStatus: string | null
  currentPeriodEnd: string | null
  credits: number
  attempts: number
  lastActiveAt: string | null
  spendCents: number
  createdAt: string
}

type Response = {
  users: UserRow[]
  page: number
  pageSize: number
  total: number
  summary: {
    byStatus: Record<string, number>
    byRole: Record<string, number>
    verified: number
    newThisWeek: number
  }
}

const PAGE_SIZE = 25

export const ROLE_LABELS: Record<string, string> = {
  student: 'Student',
  content_editor: 'Content editor',
  expert_reviewer: 'Expert reviewer',
  admin: 'Admin',
}

export const PLAN_LABELS: Record<string, string> = {
  free: 'Free',
  paid: 'Paid',
  premium: 'Premium',
}

export function statusTone(status: string) {
  if (status === 'active') return 'good' as const
  if (status === 'locked') return 'warning' as const
  return 'critical' as const
}

/**
 * The roster. Filters are local state (the rest of the admin area works the
 * same way) and the detail lives in a drawer rather than a separate route, so
 * support can work a list of accounts without losing their place in it.
 */
export function UsersManager({ currentUserId }: { currentUserId: string }) {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [plan, setPlan] = useState('')
  const [activity, setActivity] = useState('')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Response | null>(null)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE), sort })
    if (search) p.set('q', search)
    if (role) p.set('role', role)
    if (status) p.set('status', status)
    if (plan) p.set('plan', plan)
    if (activity) p.set('activity', activity)
    return p.toString()
  }, [page, search, role, status, plan, activity, sort])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/users?${query}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load users')
        setData(body)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [query, tick])

  const refresh = useCallback(() => setTick((n) => n + 1), [])

  const rows = data?.users ?? []
  const total = data?.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const summary = data?.summary
  const filtered = Boolean(search || role || status || plan || activity)

  /** Any filter change returns to page 1 — page 4 of a narrowed list is empty. */
  function filterSetter(set: (v: string) => void) {
    return (v: string) => {
      set(v)
      setPage(1)
    }
  }

  function reset() {
    setQ('')
    setRole('')
    setStatus('')
    setPlan('')
    setActivity('')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Users"
        lede="Every account on the platform, with its plan, credit balance and current state. Open one to grant entitlements, adjust credits or suspend it."
      />

      {summary && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MiniStat label="Total accounts" value={count(total)} />
          <MiniStat label="New this week" value={count(summary.newThisWeek)} />
          <MiniStat label="Verified" value={count(summary.verified)} />
          <MiniStat
            label="Suspended or locked"
            value={count((summary.byStatus.locked ?? 0) + (summary.byStatus.deleted ?? 0))}
          />
        </div>
      )}

      <Section
        title="Roster"
        description={`${count(total)} account${total === 1 ? '' : 's'} match the current filters.`}
        actions={
          filtered ? (
            <Button variant="ghost" size="sm" onClick={reset}>
              Clear filters
            </Button>
          ) : null
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search users"
            className={cn(inputClass, 'w-full sm:w-72')}
          />
          <Filter value={role} onChange={filterSetter(setRole)} label="Role">
            <option value="">All roles</option>
            {Object.entries(ROLE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Filter>
          <Filter value={status} onChange={filterSetter(setStatus)} label="Status">
            <option value="">Any status</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="deleted">Deleted</option>
          </Filter>
          <Filter value={plan} onChange={filterSetter(setPlan)} label="Plan">
            <option value="">Any plan</option>
            {Object.entries(PLAN_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Filter>
          <Filter value={activity} onChange={filterSetter(setActivity)} label="Activity">
            <option value="">Any activity</option>
            <option value="active_7d">Active in 7 days</option>
            <option value="dormant_30d">Dormant 30+ days</option>
            <option value="never">Never practised</option>
          </Filter>
          <Filter value={sort} onChange={filterSetter(setSort)} label="Sort">
            <option value="recent">Newest first</option>
            <option value="activity">Recently active</option>
            <option value="spend">Highest spend</option>
            <option value="name">Name A–Z</option>
          </Filter>
        </div>

        {error && <EmptyState title="Could not load users" hint={error} />}

        {!error && rows.length === 0 && (
          <EmptyState
            title="No accounts match"
            hint={filtered ? 'Try widening or clearing the filters.' : 'Nobody has registered yet.'}
          />
        )}

        {rows.length > 0 && (
          <TableShell>
            <thead>
              <tr>
                <Th>Account</Th>
                <Th>Role</Th>
                <Th>Plan</Th>
                <Th className="text-right">Credits</Th>
                <Th className="text-right">Attempts</Th>
                <Th className="text-right">Lifetime spend</Th>
                <Th>Last active</Th>
                <Th>Status</Th>
                <Th className="text-right">Joined</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setOpenId(u.id)}
                  className="cursor-pointer transition-colors hover:bg-sunk/70"
                >
                  <Td>
                    <button
                      type="button"
                      className="text-left"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenId(u.id)
                      }}
                    >
                      <span className="block font-medium text-ink">{u.name}</span>
                      <span className="block text-xs text-ink-muted">{u.email}</span>
                    </button>
                  </Td>
                  <Td className="text-ink-muted">{ROLE_LABELS[u.role] ?? u.role}</Td>
                  <Td>
                    <StatusPill tone={u.planCode === 'free' ? 'neutral' : 'good'} dot={false}>
                      {PLAN_LABELS[u.planCode] ?? u.planCode}
                    </StatusPill>
                  </Td>
                  <Td className="text-right tabular-nums">{count(u.credits)}</Td>
                  <Td className="text-right text-ink-muted tabular-nums">{compact(u.attempts)}</Td>
                  <Td className="text-right tabular-nums">
                    {u.spendCents > 0 ? money(u.spendCents) : '—'}
                  </Td>
                  <Td className="text-ink-muted">{relative(u.lastActiveAt)}</Td>
                  <Td>
                    <StatusPill tone={statusTone(u.status)}>
                      {u.status === 'active' && !u.emailVerified ? 'Unverified' : u.status}
                    </StatusPill>
                  </Td>
                  <Td className="text-right text-xs text-ink-muted">{dateTime(u.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}

        {pages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-ink-muted">
              Page {page} of {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Section>

      {openId && (
        <UserDetailDrawer
          userId={openId}
          isSelf={openId === currentUserId}
          onClose={() => setOpenId(null)}
          onChanged={refresh}
        />
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-4 shadow-card">
      <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-ink tabular-nums">{value}</p>
    </div>
  )
}

function Filter({
  value,
  onChange,
  label,
  children,
}: {
  value: string
  onChange: (v: string) => void
  label: string
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
    >
      {children}
    </select>
  )
}
