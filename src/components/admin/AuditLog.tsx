'use client'

import { useEffect, useMemo, useState } from 'react'
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
import { count, dateTime } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Entry = {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  metadata: Record<string, unknown> | null
  ip: string | null
  createdAt: string
  actorName: string | null
  actorEmail: string | null
}

const PAGE = 50

/** Actions that change money, access or account state read as consequential. */
function actionTone(action: string) {
  if (/refund|revoke|delete|status/.test(action)) return 'critical' as const
  if (/credits|grant|role|apikey|integration/.test(action)) return 'warning' as const
  return 'neutral' as const
}

/**
 * The audit trail. Every administrative action already writes here; this is
 * simply the reading end of it — who did what, to whom, and from where.
 */
export function AuditLog() {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState<{
    entries: Entry[]
    actions: { action: string; n: number }[]
  } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim())
      setOffset(0)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const query = useMemo(() => {
    const p = new URLSearchParams({ limit: String(PAGE), offset: String(offset) })
    if (search) p.set('q', search)
    if (action) p.set('action', action)
    return p.toString()
  }, [search, action, offset])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/audit?${query}`)
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load the audit log')
        setData(body)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [query])

  if (error) return <EmptyState title="Audit log unavailable" hint={error} />

  const entries = data?.entries ?? []

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Audit log"
        lede="Every administrative action, in order. Entries are append-only — nothing here can be edited from the panel."
      />

      <Section
        title="Trail"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search actor, action or target"
              aria-label="Search the audit log"
              className={cn(inputClass, 'w-full sm:w-64')}
            />
            <select
              value={action}
              onChange={(e) => {
                setAction(e.target.value)
                setOffset(0)
              }}
              aria-label="Filter by action"
              className={selectClass}
            >
              <option value="">All actions</option>
              {(data?.actions ?? []).map((a) => (
                <option key={a.action} value={a.action}>
                  {a.action} ({a.n})
                </option>
              ))}
            </select>
          </div>
        }
      >
        {entries.length === 0 ? (
          <EmptyState
            title="Nothing recorded"
            hint="Administrative actions appear here as they happen."
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Actor</Th>
                  <Th>Action</Th>
                  <Th>Target</Th>
                  <Th>Detail</Th>
                  <Th>IP</Th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <Td className="text-xs whitespace-nowrap text-ink-muted">
                      {dateTime(e.createdAt)}
                    </Td>
                    <Td>
                      <span className="block text-ink">{e.actorName ?? 'System'}</span>
                      {e.actorEmail && (
                        <span className="block text-xs text-ink-muted">{e.actorEmail}</span>
                      )}
                    </Td>
                    <Td>
                      <StatusPill tone={actionTone(e.action)} dot={false}>
                        {e.action}
                      </StatusPill>
                    </Td>
                    <Td className="text-xs text-ink-muted">
                      {e.targetType ? (
                        <>
                          <span className="block">{e.targetType}</span>
                          {e.targetId && (
                            <code className="block break-all">{e.targetId.slice(0, 18)}</code>
                          )}
                        </>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td className="max-w-[18rem] text-xs text-ink-muted">
                      {e.metadata && Object.keys(e.metadata).length > 0 ? (
                        <code className="break-all">
                          {Object.entries(e.metadata)
                            .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                            .join(' ')}
                        </code>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td className="text-xs text-ink-muted">{e.ip ?? '—'}</Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <Button
                variant="outline"
                size="sm"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE))}
              >
                Newer
              </Button>
              <span className="text-ink-muted">
                Showing {count(offset + 1)}–{count(offset + entries.length)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={entries.length < PAGE}
                onClick={() => setOffset((o) => o + PAGE)}
              >
                Older
              </Button>
            </div>
          </>
        )}
      </Section>
    </div>
  )
}
