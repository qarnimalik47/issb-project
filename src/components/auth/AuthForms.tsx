'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries'

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

function fieldError(data: {
  error?: { message?: string; details?: { message: string }[] }
}): string {
  if (data?.error?.details?.length) return data.error.details[0]!.message
  return data?.error?.message ?? 'Something went wrong'
}

const inputCls =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-brand-500'
const btnCls =
  'w-full rounded-pill bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-55 dark:bg-brand-500 dark:hover:bg-brand-400'

export function LoginForm({ t }: { t: Dictionary }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(e.currentTarget)
    const { ok, data } = await postJson('/api/auth/login', {
      email: form.get('email'),
      password: form.get('password'),
    })
    setBusy(false)
    if (!ok) return setError(fieldError(data))
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input name="email" type="email" required placeholder={t.common.email} className={inputCls} />
      <input
        name="password"
        type="password"
        required
        placeholder={t.common.password}
        className={inputCls}
      />
      {error && <p className="text-sm text-flare-500">{error}</p>}
      <button type="submit" disabled={busy} className={btnCls}>
        {busy ? t.common.loading : t.common.signIn}
      </button>
      <a
        href="/forgot-password"
        className="text-center text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        {t.auth.forgot}
      </a>
    </form>
  )
}

export function RegisterForm({ t }: { t: Dictionary }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    const phone = String(f.get('phone') ?? '').trim()
    const { ok, data } = await postJson('/api/auth/register', {
      name: f.get('name'),
      email: f.get('email'),
      phone: phone || undefined,
      password: f.get('password'),
      courseTrack: f.get('courseTrack') || undefined,
      acceptTerms: f.get('acceptTerms') === 'on',
      consent: {
        storeWritten: f.get('storeWritten') === 'on',
        storeVoice: f.get('storeVoice') === 'on',
        storeAssessment: f.get('storeAssessment') === 'on',
      },
    })
    setBusy(false)
    if (!ok) return setError(fieldError(data))
    router.push('/verify')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input name="name" required placeholder={t.common.name} className={inputCls} />
      <input name="email" type="email" required placeholder={t.common.email} className={inputCls} />
      <input name="phone" placeholder={t.common.phone} className={inputCls} />
      <input
        name="password"
        type="password"
        required
        placeholder={t.common.password}
        className={inputCls}
      />
      <select name="courseTrack" className={inputCls} defaultValue="">
        <option value="" disabled>
          {t.auth.courseTrack}
        </option>
        {(['pma', 'gdp', 'navy', 'lcc', 'technical', 'other'] as const).map((k) => (
          <option key={k} value={k}>
            {t.tracks[k]}
          </option>
        ))}
      </select>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="storeWritten" defaultChecked className="mt-1" />
        {t.auth.consentWritten}
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="storeVoice" className="mt-1" />
        {t.auth.consentVoice}
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="storeAssessment" defaultChecked className="mt-1" />
        {t.auth.consentAssessment}
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="acceptTerms" required className="mt-1" />
        {t.auth.acceptTerms}
      </label>
      {error && <p className="text-sm text-flare-500">{error}</p>}
      <button type="submit" disabled={busy} className={btnCls}>
        {busy ? t.common.loading : t.common.register}
      </button>
    </form>
  )
}

export function VerifyForm({ t }: { t: Dictionary }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [resent, setResent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    const { ok, data } = await postJson('/api/auth/otp/confirm', {
      purpose: 'verify_email',
      code: String(f.get('code') ?? '').trim(),
    })
    setBusy(false)
    if (!ok) return setError(fieldError(data))
    router.push('/dashboard')
    router.refresh()
  }

  async function resend() {
    await postJson('/api/auth/otp/request', { purpose: 'verify_email' })
    setResent(true)
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <p className="text-sm text-ink-muted">{t.auth.verifyPrompt}</p>
      <input
        name="code"
        inputMode="numeric"
        pattern="[0-9]{6}"
        required
        placeholder={t.auth.code}
        className={inputCls}
      />
      {error && <p className="text-sm text-flare-500">{error}</p>}
      <button type="submit" disabled={busy} className={btnCls}>
        {busy ? t.common.loading : t.auth.verify}
      </button>
      <button
        type="button"
        onClick={resend}
        className="text-center text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        {resent ? t.common.saved : t.auth.resend}
      </button>
    </form>
  )
}

export function ForgotForm({ t }: { t: Dictionary }) {
  const [stage, setStage] = useState<'request' | 'confirm'>('request')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function request(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    const em = String(f.get('email') ?? '')
    await postJson('/api/auth/password/request', { email: em })
    setEmail(em)
    setBusy(false)
    setStage('confirm')
  }

  async function confirm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const f = new FormData(e.currentTarget)
    const { ok, data } = await postJson('/api/auth/password/confirm', {
      email,
      code: String(f.get('code') ?? '').trim(),
      password: f.get('password'),
    })
    setBusy(false)
    if (!ok) return setError(fieldError(data))
    setDone(true)
  }

  if (done) {
    return (
      <p className="text-sm text-green-600">
        {t.common.saved}.{' '}
        <a href="/login" className="underline">
          {t.common.signIn}
        </a>
      </p>
    )
  }

  return stage === 'request' ? (
    <form onSubmit={request} className="flex flex-col gap-3">
      <input name="email" type="email" required placeholder={t.common.email} className={inputCls} />
      <button type="submit" disabled={busy} className={btnCls}>
        {busy ? t.common.loading : t.common.submit}
      </button>
    </form>
  ) : (
    <form onSubmit={confirm} className="flex flex-col gap-3">
      <p className="text-sm text-ink-muted">{t.auth.verifyPrompt}</p>
      <input
        name="code"
        inputMode="numeric"
        required
        placeholder={t.auth.code}
        className={inputCls}
      />
      <input
        name="password"
        type="password"
        required
        placeholder={t.common.password}
        className={inputCls}
      />
      {error && <p className="text-sm text-flare-500">{error}</p>}
      <button type="submit" disabled={busy} className={btnCls}>
        {busy ? t.common.loading : t.common.submit}
      </button>
    </form>
  )
}
