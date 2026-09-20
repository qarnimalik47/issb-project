'use client'

import { useCallback, useEffect, useState } from 'react'

type Licence =
  'public_domain' | 'cc_by' | 'official_sample' | 'owned_licence' | 'third_party_unlicensed'

type Source = {
  id: string
  domain: string
  enabled: boolean
  licence: Licence
  attribution: string | null
  tosReviewedAt: string | null
  maxPages: number
  notes: string | null
  questionsFromSource: number
}
type Config = { enabled: boolean; allowedDomains: string[] }
type TestType = { id: string; nameEn: string; scoringType: string }

const LICENCES: { value: Licence; label: string }[] = [
  { value: 'third_party_unlicensed', label: 'Third-party, no licence — rewrite required' },
  { value: 'public_domain', label: 'Public domain' },
  { value: 'cc_by', label: 'Creative Commons BY — attribution added' },
  { value: 'official_sample', label: 'Official published sample' },
  { value: 'owned_licence', label: 'Licensed to us for reuse' },
]

const inputCls =
  'rounded-lg border border-line-strong bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30 dark:border-neutral-700 dark:bg-neutral-900'
const btnCls =
  'rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunk disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800'
const primaryCls =
  'rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40 dark:bg-brand-500 dark:text-brand-950'

/**
 * The scraper's allow-list. A domain is only ever fetched when it is BOTH in
 * SCRAPE_ALLOWED_DOMAINS on the server and enabled here — and enabling it
 * requires confirming that a person has read the site's terms of service.
 */
export function SourcesManager() {
  const [sources, setSources] = useState<Source[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [testTypes, setTestTypes] = useState<TestType[]>([])
  const [message, setMessage] = useState<{
    tone: 'ok' | 'error'
    text: string
    href?: string
  } | null>(null)
  const [form, setForm] = useState({
    domain: '',
    licence: 'third_party_unlicensed' as Licence,
    attribution: '',
  })
  const [runFor, setRunFor] = useState<string | null>(null)
  const [urls, setUrls] = useState('')
  const [runTestType, setRunTestType] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/sources')
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      setMessage({ tone: 'error', text: body?.error?.message ?? 'Could not load sources' })
      return
    }
    setSources(body.sources)
    setConfig(body.config)
  }, [])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- data fetch on mount */
    void load()
    fetch('/api/catalog/test-types')
      .then((r) => r.json())
      .then((d) =>
        setTestTypes((d.testTypes ?? []).filter((t: TestType) => t.scoringType === 'objective')),
      )
      .catch(() => {})
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [load])

  async function call(url: string, method: string, body: unknown, ok: string) {
    setMessage(null)
    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const details: { message: string }[] = data?.error?.details ?? []
      setMessage({
        tone: 'error',
        text: [
          data?.error?.message ?? 'Request failed',
          ...details.slice(1).map((d) => d.message),
        ].join(' · '),
      })
      return null
    }
    setMessage({ tone: 'ok', text: ok })
    await load()
    return data
  }

  const inEnv = (domain: string) => config?.allowedDomains.includes(domain) ?? false

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-xl border p-4 text-sm ${
          config?.enabled
            ? 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100'
            : 'border-line bg-sunk text-ink-muted dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300'
        }`}
      >
        <p className="font-semibold">
          Scraping is {config?.enabled ? 'switched ON' : 'switched OFF'} on this server
        </p>
        <p className="mt-1">
          {config?.enabled
            ? `Domains permitted by the server: ${config.allowedDomains.join(', ') || 'none'}.`
            : 'Nothing will be fetched until SCRAPE_ENABLED=true and the domain is listed in SCRAPE_ALLOWED_DOMAINS in the server’s .env.'}
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
        <p className="font-semibold">Before enabling a source</p>
        <ul className="mt-1 list-disc ps-5">
          <li>
            Obeying robots.txt is not the same as being allowed: read the site’s terms of service —
            many forbid automated access outright.
          </li>
          <li>
            Third-party questions must be rewritten in your own words before approval; this is
            enforced.
          </li>
          <li>
            Rewording protects against copying expression, not against copying a whole collection.
            Keep any one site’s share of the bank small (shown per source below).
          </li>
        </ul>
      </div>

      {message && (
        <p
          role={message.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
              : 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100'
          }`}
        >
          {message.text}{' '}
          {message.href && (
            <a href={message.href} className="font-medium underline">
              Review imports →
            </a>
          )}
        </p>
      )}

      <form
        className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-[1fr_1.4fr_1fr_auto] sm:items-end"
        onSubmit={async (e) => {
          e.preventDefault()
          const r = await call(
            '/api/admin/sources',
            'POST',
            { ...form, attribution: form.attribution || null },
            'Source added — it starts disabled.',
          )
          if (r) setForm({ domain: '', licence: 'third_party_unlicensed', attribution: '' })
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Domain
          <input
            className={inputCls}
            placeholder="example.org"
            value={form.domain}
            required
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Licence
          <select
            className={inputCls}
            value={form.licence}
            onChange={(e) => setForm({ ...form, licence: e.target.value as Licence })}
          >
            {LICENCES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Attribution (if required)
          <input
            className={inputCls}
            value={form.attribution}
            onChange={(e) => setForm({ ...form, attribution: e.target.value })}
          />
        </label>
        <button className={primaryCls}>Add source</button>
      </form>

      <ul className="flex flex-col gap-3">
        {sources.length === 0 && <li className="text-sm text-ink-muted">No sources yet.</li>}
        {sources.map((s) => (
          <li key={s.id} className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {s.domain}{' '}
                  <span
                    className={`ms-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      s.enabled
                        ? 'bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-200'
                        : 'bg-sunk text-ink-muted dark:bg-neutral-800 dark:text-neutral-300'
                    }`}
                  >
                    {s.enabled ? 'enabled' : 'disabled'}
                  </span>
                  {!inEnv(s.domain) && (
                    <span className="ms-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      not permitted by the server
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {LICENCES.find((l) => l.value === s.licence)?.label} · up to {s.maxPages} pages
                  per run · {s.questionsFromSource} question{s.questionsFromSource === 1 ? '' : 's'}{' '}
                  in the bank from this site
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(s.tosReviewedAt)}
                    onChange={(e) =>
                      void call(
                        `/api/admin/sources/${s.id}`,
                        'PATCH',
                        {
                          tosReviewed: e.target.checked,
                          ...(e.target.checked ? {} : { enabled: false }),
                        },
                        e.target.checked
                          ? 'Terms review recorded.'
                          : 'Terms review cleared; source disabled.',
                      )
                    }
                  />
                  I have read this site’s terms
                  {s.tosReviewedAt && (
                    <span className="text-xs text-ink-muted">
                      ({new Date(s.tosReviewedAt).toLocaleDateString()})
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  className={btnCls}
                  disabled={!s.enabled && !s.tosReviewedAt}
                  onClick={() =>
                    void call(
                      `/api/admin/sources/${s.id}`,
                      'PATCH',
                      { enabled: !s.enabled },
                      s.enabled ? 'Source disabled.' : 'Source enabled.',
                    )
                  }
                >
                  {s.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  className={btnCls}
                  disabled={!s.enabled}
                  onClick={() => setRunFor(runFor === s.id ? null : s.id)}
                >
                  Scrape pages…
                </button>
              </div>
            </div>

            {runFor === s.id && (
              <form
                className="mt-4 flex flex-col gap-3 border-t border-line pt-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const r = await call(
                    `/api/admin/sources/${s.id}/runs`,
                    'POST',
                    { urls: urls.split(/\s+/).filter(Boolean), testTypeId: runTestType || null },
                    'Queued. Pages are fetched politely in the background by the worker.',
                  )
                  if (r) {
                    setMessage({
                      tone: 'ok',
                      text: `Queued ${r.documents} page(s). The worker fetches them politely in the background.`,
                      href: '/admin/import',
                    })
                    setUrls('')
                    setRunFor(null)
                  }
                }}
              >
                <label className="flex flex-col gap-1 text-sm font-medium">
                  Page URLs on {s.domain} (one per line, max {s.maxPages})
                  <textarea
                    className={`${inputCls} min-h-28 font-mono`}
                    value={urls}
                    required
                    onChange={(e) => setUrls(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium sm:max-w-xs">
                  Test type for the imported questions
                  <select
                    className={inputCls}
                    value={runTestType}
                    onChange={(e) => setRunTestType(e.target.value)}
                  >
                    <option value="">Decide later</option>
                    {testTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nameEn}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <button className={primaryCls}>Queue pages</button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
