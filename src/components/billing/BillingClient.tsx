'use client'

import { useCallback, useEffect, useState } from 'react'

type Sub = {
  plan: string
  entitlements: {
    aiEvaluationsPerDay: number
    mockInterviewsPerMonth: number
    expertReviewsPerMonth: number
  }
  invoices: {
    id: string
    number: string
    planCode: string
    amountCents: number
    currency: string
    issuedAt: string
  }[]
}

const PLAN_CARDS = [
  {
    code: 'paid',
    name: 'Paid',
    blurb: 'AI evaluation, personality profile, mock interview, unlimited MCQ.',
  },
  { code: 'premium', name: 'Premium', blurb: 'Everything in Paid + monthly human expert reviews.' },
] as const

export function BillingClient() {
  const [sub, setSub] = useState<Sub | null>(null)
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/billing/subscription')
    if (res.ok) setSub(await res.json())
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function subscribe(planCode: string) {
    setBusy(planCode)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ planCode, gateway: 'mock' }),
    })
    const d = await res.json()
    setBusy('')
    if (res.ok && d.checkoutUrl) window.location.assign(d.checkoutUrl)
  }

  if (!sub) return <p className="text-neutral-500">Loading…</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-neutral-200 p-4 text-sm dark:border-neutral-800">
        Current plan: <strong className="uppercase">{sub.plan}</strong> · AI evaluations/day:{' '}
        {sub.entitlements.aiEvaluationsPerDay} · expert reviews/month:{' '}
        {sub.entitlements.expertReviewsPerMonth}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLAN_CARDS.map((p) => (
          <div
            key={p.code}
            className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <div className="text-lg font-semibold">{p.name}</div>
            <p className="mt-1 text-sm text-neutral-500">{p.blurb}</p>
            <p className="mt-1 text-xs text-neutral-400">
              Price set by the platform (demo uses a mock gateway).
            </p>
            <button
              onClick={() => subscribe(p.code)}
              disabled={busy === p.code || sub.plan === p.code}
              className="mt-3 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
            >
              {sub.plan === p.code
                ? 'Current'
                : busy === p.code
                  ? 'Redirecting…'
                  : `Subscribe to ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      {sub.invoices.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Invoices</h2>
          <ul className="text-sm">
            {sub.invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex justify-between border-b border-neutral-100 py-1 dark:border-neutral-800"
              >
                <span>
                  {inv.number} · {inv.planCode}
                </span>
                <span>
                  {(inv.amountCents / 100).toFixed(2)} {inv.currency} · {inv.issuedAt.slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
