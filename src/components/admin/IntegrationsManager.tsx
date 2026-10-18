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
import { count, money, relative, usd } from './ui/format'
import { Button } from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'

type Field = {
  key: string
  label: string
  type: 'secret' | 'text'
  placeholder?: string
  required?: boolean
  help?: string
}

type Provider = {
  slug: string
  label: string
  category: 'ai' | 'payments' | 'messaging' | 'storage' | 'analytics'
  summary: string
  docsUrl: string
  fields: Field[]
  testable: boolean
  configured: boolean
  fromEnv: boolean
  enabled: boolean
  status: 'unknown' | 'ok' | 'error'
  maskedSecrets: Record<string, string>
  config: Record<string, string>
  lastCheckedAt: string | null
  lastLatencyMs: number | null
  lastError: string | null
}

type Usage = {
  ai: {
    slug: string
    calls: number
    tokensIn: number
    tokensOut: number
    costUsd: number
    failures: number
  }[]
  gateways: { slug: string; calls: number; paid: number; failures: number; volumeCents: number }[]
  days: number
}

const CATEGORY_LABELS: Record<Provider['category'], string> = {
  ai: 'AI providers',
  payments: 'Payment gateways',
  messaging: 'Messaging',
  storage: 'Storage',
  analytics: 'Analytics',
}

function statusOf(p: Provider) {
  if (!p.configured) return { tone: 'neutral' as const, label: 'Not configured' }
  if (!p.enabled) return { tone: 'neutral' as const, label: 'Disabled' }
  if (p.status === 'ok') return { tone: 'good' as const, label: 'Connected' }
  if (p.status === 'error') return { tone: 'critical' as const, label: 'Failing' }
  return { tone: 'warning' as const, label: 'Untested' }
}

/**
 * Provider credentials and their live state.
 *
 * Secrets go one way: an operator types a key in and sees only a mask
 * afterwards. Leaving a secret field blank keeps what is stored, so editing a
 * model name never means re-pasting an API key.
 */
export function IntegrationsManager() {
  const [providers, setProviders] = useState<Provider[] | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/integrations')
      .then(async (r) => {
        const body = await r.json()
        if (cancelled) return
        if (!r.ok) throw new Error(body?.error?.message ?? 'Could not load integrations')
        setProviders(body.providers)
        setUsage(body.usage)
        setError('')
      })
      .catch((e: Error) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [])

  async function save(slug: string, payload: Record<string, unknown>, success: string) {
    setBusy(slug)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, ...payload }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'Could not save')
      setProviders(body.providers)
      setMessage({ tone: 'good', text: success })
      setEditing(null)
    } catch (e) {
      setMessage({ tone: 'critical', text: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  async function test(slug: string) {
    setBusy(slug)
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/integrations/${slug}/test`, { method: 'POST' })
      const body = await res.json()
      if (!res.ok) throw new Error(body?.error?.message ?? 'The test could not run')
      setProviders(body.providers)
      setMessage({
        tone: body.ok ? 'good' : 'critical',
        text: `${slug}: ${body.detail} (${body.latencyMs} ms)`,
      })
    } catch (e) {
      setMessage({ tone: 'critical', text: (e as Error).message })
    } finally {
      setBusy('')
    }
  }

  if (error) return <EmptyState title="Integrations unavailable" hint={error} />
  if (!providers) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-card border border-line bg-surface" />
        ))}
      </div>
    )
  }

  const categories = Array.from(new Set(providers.map((p) => p.category)))
  const aiLive = providers.filter((p) => p.category === 'ai' && p.enabled && p.status === 'ok')

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Integrations"
        lede="Credentials for the services the platform calls out to. Keys are encrypted at rest and never shown again after you save them — only a mask."
      />

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {aiLive.length === 0 && (
        <Notice tone="warning">
          No AI provider is connected, so written evaluation falls back to the deterministic mock.
          Mock results are recorded as <code>model=mock</code> and are never presented as genuine
          assessment.
        </Notice>
      )}

      {categories.map((category) => (
        <Section key={category} title={CATEGORY_LABELS[category]}>
          <div className="grid gap-4 md:grid-cols-2">
            {providers
              .filter((p) => p.category === category)
              .map((p) => (
                <ProviderCard
                  key={p.slug}
                  provider={p}
                  editing={editing === p.slug}
                  busy={busy === p.slug}
                  onEdit={() => setEditing(editing === p.slug ? null : p.slug)}
                  onSave={(secrets, config) =>
                    save(p.slug, { secrets, config, enabled: true }, `${p.label} saved.`)
                  }
                  onToggle={() =>
                    save(
                      p.slug,
                      { enabled: !p.enabled },
                      `${p.label} ${p.enabled ? 'disabled' : 'enabled'}.`,
                    )
                  }
                  onTest={() => test(p.slug)}
                />
              ))}
          </div>
        </Section>
      ))}

      {usage && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Section
            title="AI usage"
            description={`Calls booked against each model in the last ${usage.days} days.`}
          >
            {usage.ai.length === 0 ? (
              <EmptyState title="No AI calls yet" hint="Usage appears once evaluations run." />
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Provider</Th>
                    <Th className="text-right">Calls</Th>
                    <Th className="text-right">Tokens in</Th>
                    <Th className="text-right">Tokens out</Th>
                    <Th className="text-right">Cost</Th>
                    <Th className="text-right">Failures</Th>
                  </tr>
                </thead>
                <tbody>
                  {usage.ai.map((row) => (
                    <tr key={row.slug}>
                      <Td className="font-medium text-ink capitalize">{row.slug}</Td>
                      <Td className="text-right tabular-nums">{count(row.calls)}</Td>
                      <Td className="text-right text-ink-muted tabular-nums">
                        {count(row.tokensIn)}
                      </Td>
                      <Td className="text-right text-ink-muted tabular-nums">
                        {count(row.tokensOut)}
                      </Td>
                      <Td className="text-right tabular-nums">{usd(row.costUsd)}</Td>
                      <Td
                        className={cn(
                          'text-right tabular-nums',
                          row.failures > 0 && 'text-flare-600 dark:text-flare-100',
                        )}
                      >
                        {count(row.failures)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}
          </Section>

          <Section
            title="Gateway usage"
            description={`Checkout attempts in the last ${usage.days} days.`}
          >
            {usage.gateways.length === 0 ? (
              <EmptyState title="No checkouts yet" hint="Usage appears once payments are taken." />
            ) : (
              <TableShell>
                <thead>
                  <tr>
                    <Th>Gateway</Th>
                    <Th className="text-right">Attempts</Th>
                    <Th className="text-right">Paid</Th>
                    <Th className="text-right">Failures</Th>
                    <Th className="text-right">Volume</Th>
                  </tr>
                </thead>
                <tbody>
                  {usage.gateways.map((row) => (
                    <tr key={row.slug}>
                      <Td className="font-medium text-ink capitalize">{row.slug}</Td>
                      <Td className="text-right tabular-nums">{count(row.calls)}</Td>
                      <Td className="text-right tabular-nums">{count(row.paid)}</Td>
                      <Td
                        className={cn(
                          'text-right tabular-nums',
                          row.failures > 0 && 'text-flare-600 dark:text-flare-100',
                        )}
                      >
                        {count(row.failures)}
                      </Td>
                      <Td className="text-right tabular-nums">{money(row.volumeCents)}</Td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            )}
          </Section>
        </div>
      )}
    </div>
  )
}

function ProviderCard({
  provider,
  editing,
  busy,
  onEdit,
  onSave,
  onToggle,
  onTest,
}: {
  provider: Provider
  editing: boolean
  busy: boolean
  onEdit: () => void
  onSave: (secrets: Record<string, string>, config: Record<string, string>) => void
  onToggle: () => void
  onTest: () => void
}) {
  const [values, setValues] = useState<Record<string, string>>({})
  const state = statusOf(provider)

  function submit() {
    const secrets: Record<string, string> = {}
    const config: Record<string, string> = {}
    for (const field of provider.fields) {
      const v = values[field.key]
      if (v === undefined || v.trim() === '') continue
      if (field.type === 'secret') secrets[field.key] = v.trim()
      else config[field.key] = v.trim()
    }
    onSave(secrets, config)
    setValues({})
  }

  return (
    <article className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-bold text-ink">{provider.label}</h3>
          <p className="mt-1 text-xs text-ink-muted">{provider.summary}</p>
        </div>
        <StatusPill tone={state.tone}>{state.label}</StatusPill>
      </header>

      <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
        {Object.entries(provider.maskedSecrets).map(([key, mask]) => (
          <div key={key}>
            <dt className="inline font-medium">{key}: </dt>
            <dd className="inline">
              <code>{mask}</code>
            </dd>
          </div>
        ))}
        {provider.fromEnv && (
          <div>
            <dt className="inline font-medium">Source: </dt>
            <dd className="inline">environment variable</dd>
          </div>
        )}
        {provider.lastCheckedAt && (
          <div>
            <dt className="inline font-medium">Checked: </dt>
            <dd className="inline">
              {relative(provider.lastCheckedAt)}
              {provider.lastLatencyMs !== null && ` · ${provider.lastLatencyMs} ms`}
            </dd>
          </div>
        )}
      </dl>

      {provider.status === 'error' && provider.lastError && (
        <p className="rounded-lg border border-flare-100 bg-flare-50 px-2.5 py-1.5 text-xs text-flare-700 dark:border-flare-700 dark:bg-flare-700/20 dark:text-flare-100">
          {provider.lastError}
        </p>
      )}

      {editing && (
        <div className="flex flex-col gap-3 border-t border-line pt-3">
          {provider.fields.map((field) => (
            <div key={field.key}>
              <label
                htmlFor={`${provider.slug}-${field.key}`}
                className="block text-xs font-semibold text-ink-muted"
              >
                {field.label}
                {field.type === 'secret' && provider.maskedSecrets[field.key] && (
                  <span className="ml-1 font-normal">— leave blank to keep the stored value</span>
                )}
              </label>
              <input
                id={`${provider.slug}-${field.key}`}
                type={field.type === 'secret' ? 'password' : 'text'}
                autoComplete="off"
                value={
                  values[field.key] ??
                  (field.type === 'text' ? (provider.config[field.key] ?? '') : '')
                }
                placeholder={field.placeholder}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                className={cn(inputClass, 'mt-1')}
              />
              {field.help && <p className="mt-1 text-xs text-ink-muted">{field.help}</p>}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" disabled={busy} onClick={submit}>
              {busy ? 'Saving…' : 'Save credentials'}
            </Button>
            <Button size="sm" variant="ghost" onClick={onEdit}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!editing && (
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
          <Button size="sm" variant="outline" onClick={onEdit}>
            {provider.configured ? 'Update credentials' : 'Add credentials'}
          </Button>
          {provider.testable && (
            <Button
              size="sm"
              variant="ghost"
              disabled={busy || !provider.configured}
              onClick={onTest}
            >
              {busy ? 'Testing…' : 'Test connection'}
            </Button>
          )}
          {provider.configured && (
            <Button size="sm" variant="ghost" disabled={busy} onClick={onToggle}>
              {provider.enabled ? 'Disable' : 'Enable'}
            </Button>
          )}
          <a
            href={provider.docsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="ml-auto text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Docs ↗
          </a>
        </div>
      )}
    </article>
  )
}
