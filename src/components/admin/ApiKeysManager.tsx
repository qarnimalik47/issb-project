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
} from './ui/Primitives'
import { count, dateTime, relative } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Key = {
  id: string
  name: string
  description: string | null
  keyPrefix: string
  scopes: string[]
  rateLimitPerMinute: number
  status: string
  requestCount: number
  lastUsedAt: string | null
  lastUsedIp: string | null
  expiresAt: string | null
  createdAt: string
  revokedAt: string | null
  createdByName: string | null
  expired: boolean
}

type Scope = { value: string; label: string }

/**
 * Keys issued to the mobile app and partners.
 *
 * The plaintext key exists in exactly one response, right after it is minted —
 * only a hash is stored. That is deliberately inconvenient: it means a leaked
 * database cannot be replayed against the API, and it is why the panel makes
 * the one-time reveal impossible to miss.
 */
export function ApiKeysManager() {
  const [keys, setKeys] = useState<Key[] | null>(null)
  const [scopes, setScopes] = useState<Scope[]>([])
  const [error, setError] = useState('')
  const [issued, setIssued] = useState<{ key: string; name: string } | null>(null)
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/api-keys')
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load keys')
        setKeys(body.keys)
        setScopes(body.scopes)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [])

  async function revoke(id: string, name: string) {
    setBusy(id)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'Could not revoke the key')
      setKeys(body.keys)
      setMessage({ tone: 'good', text: `"${name}" is revoked and will stop working immediately.` })
    } catch (e) {
      setMessage({ tone: 'critical', text: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  if (error) return <EmptyState title="API keys unavailable" hint={error} />

  const active = keys?.filter((k) => k.status === 'active') ?? []

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="API keys"
        lede="Credentials for the mobile app and partner integrations. Each key carries its own scopes and rate limit, and can be revoked on the spot."
        actions={
          <Button onClick={() => setCreating((c) => !c)}>
            {creating ? 'Cancel' : 'Issue a key'}
          </Button>
        }
      />

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {issued && (
        <Section title="Copy this key now">
          <p className="text-sm text-ink-muted">
            This is the only time <strong className="text-ink">{issued.name}</strong> will be shown.
            Only a hash is stored — if you lose it, revoke the key and issue another.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <code className="flex-1 rounded-lg border border-brass-200 bg-brass-50 px-3 py-2 font-mono text-sm break-all text-brass-900 dark:border-brass-700 dark:bg-brass-900 dark:text-brass-100">
              {issued.key}
            </code>
            <Button
              variant="outline"
              onClick={() => {
                void navigator.clipboard?.writeText(issued.key)
                setMessage({ tone: 'good', text: 'Key copied to the clipboard.' })
              }}
            >
              Copy
            </Button>
            <Button variant="ghost" onClick={() => setIssued(null)}>
              Done
            </Button>
          </div>
        </Section>
      )}

      {creating && (
        <CreateKeyForm
          scopes={scopes}
          onCreated={(key, name, list) => {
            setKeys(list)
            setIssued({ key, name })
            setCreating(false)
            setMessage(null)
          }}
          onError={(text) => setMessage({ tone: 'critical', text })}
        />
      )}

      <Section
        title="Issued keys"
        description={`${count(active.length)} active of ${count(keys?.length ?? 0)} issued.`}
      >
        {!keys ? (
          <div className="h-24 animate-pulse rounded-card bg-sunk" />
        ) : keys.length === 0 ? (
          <EmptyState
            title="No keys issued"
            hint="Issue one for the mobile app or a partner integration."
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Prefix</Th>
                <Th>Scopes</Th>
                <Th className="text-right">Rate limit</Th>
                <Th className="text-right">Requests</Th>
                <Th>Last used</Th>
                <Th>Status</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => {
                // `expired` is decided by the database, not the browser clock.
                const expired = k.expired
                return (
                  <tr key={k.id}>
                    <Td>
                      <span className="block font-medium text-ink">{k.name}</span>
                      {k.description && (
                        <span className="block text-xs text-ink-muted">{k.description}</span>
                      )}
                      <span className="block text-xs text-ink-muted">
                        by {k.createdByName ?? 'unknown'} · {dateTime(k.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <code className="text-xs text-ink-muted">{k.keyPrefix}…</code>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {k.scopes.map((s) => (
                          <span
                            key={s}
                            className="rounded-pill border border-line bg-sunk px-2 py-0.5 text-[0.68rem] text-ink-muted"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </Td>
                    <Td className="text-right text-ink-muted tabular-nums">
                      {count(k.rateLimitPerMinute)}/min
                    </Td>
                    <Td className="text-right tabular-nums">{count(k.requestCount)}</Td>
                    <Td className="text-ink-muted">
                      {relative(k.lastUsedAt)}
                      {k.lastUsedIp && <span className="block text-xs">{k.lastUsedIp}</span>}
                    </Td>
                    <Td>
                      <StatusPill
                        tone={k.status === 'revoked' ? 'critical' : expired ? 'warning' : 'good'}
                      >
                        {k.status === 'revoked' ? 'Revoked' : expired ? 'Expired' : 'Active'}
                      </StatusPill>
                      {k.expiresAt && k.status === 'active' && !expired && (
                        <span className="mt-1 block text-xs text-ink-muted">
                          expires {relative(k.expiresAt)}
                        </span>
                      )}
                    </Td>
                    <Td className="text-right">
                      {k.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === k.id}
                          onClick={() => revoke(k.id, k.name)}
                        >
                          {busy === k.id ? 'Revoking…' : 'Revoke'}
                        </Button>
                      ) : (
                        <span className="text-xs text-ink-muted">
                          {k.revokedAt ? dateTime(k.revokedAt) : '—'}
                        </span>
                      )}
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </TableShell>
        )}
      </Section>

      <Section title="Using a key">
        <p className="text-sm text-ink-muted">
          Send the key on every request as a bearer token. Requests are counted per key and
          throttled at the key&rsquo;s own limit.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-sunk px-3 py-2 font-mono text-xs text-ink">
          {`curl https://<host>/api/v1/catalog/test-types \\
  -H "Authorization: Bearer issb_live_xxxxxxxx_…"`}
        </pre>
      </Section>
    </div>
  )
}

function CreateKeyForm({
  scopes,
  onCreated,
  onError,
}: {
  scopes: Scope[]
  onCreated: (key: string, name: string, keys: Key[]) => void
  onError: (text: string) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState<string[]>(['catalog:read'])
  const [rate, setRate] = useState('60')
  const [expiry, setExpiry] = useState('')
  const [busy, setBusy] = useState(false)

  const valid = name.trim().length >= 2 && selected.length > 0 && Number(rate) > 0

  async function submit() {
    setBusy(true)
    try {
      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          scopes: selected,
          rateLimitPerMinute: Number(rate),
          expiresInDays: expiry ? Number(expiry) : undefined,
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'Could not issue the key')
      onCreated(body.key, name.trim(), body.keys)
      setName('')
      setDescription('')
    } catch (e) {
      onError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Section
      title="Issue a key"
      description="Grant only the scopes the integration actually needs — a key is a standing grant until it is revoked."
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="key-name" className="block text-xs font-semibold text-ink-muted">
              Name
            </label>
            <input
              id="key-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Android app — production"
              className={cn(inputClass, 'mt-1')}
            />
          </div>
          <div>
            <label htmlFor="key-desc" className="block text-xs font-semibold text-ink-muted">
              Description (optional)
            </label>
            <input
              id="key-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Who holds this key and why"
              className={cn(inputClass, 'mt-1')}
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-xs font-semibold text-ink-muted">Scopes</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {scopes.map((s) => (
              <label
                key={s.value}
                className="flex cursor-pointer items-start gap-2 rounded-lg border border-line px-3 py-2 text-sm hover:bg-sunk"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s.value)}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked ? [...prev, s.value] : prev.filter((v) => v !== s.value),
                    )
                  }
                  className="mt-0.5 accent-brand-600"
                />
                <span>
                  <span className="block font-medium text-ink">{s.value}</span>
                  <span className="block text-xs text-ink-muted">{s.label}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="key-rate" className="block text-xs font-semibold text-ink-muted">
              Rate limit (requests/min)
            </label>
            <input
              id="key-rate"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className={cn(inputClass, 'mt-1 w-36')}
            />
          </div>
          <div>
            <label htmlFor="key-expiry" className="block text-xs font-semibold text-ink-muted">
              Expires in (days, optional)
            </label>
            <input
              id="key-expiry"
              type="number"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="never"
              className={cn(inputClass, 'mt-1 w-40')}
            />
          </div>
          <Button disabled={busy || !valid} onClick={submit}>
            {busy ? 'Issuing…' : 'Issue key'}
          </Button>
        </div>
      </div>
    </Section>
  )
}
