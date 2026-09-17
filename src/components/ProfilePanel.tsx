'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { PublicUser } from '@/lib/auth/serialize'

const inputCls =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900'

export function ProfilePanel({ t, user }: { t: Dictionary; user: PublicUser }) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setSaved(false)
    const f = new FormData(e.currentTarget)
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: f.get('name'),
        courseTrack: f.get('courseTrack') || undefined,
        targetIssbDate: f.get('targetIssbDate') || null,
      }),
    })
    setBusy(false)
    setSaved(true)
    router.refresh()
  }

  async function deleteAccount() {
    if (!confirm(t.profile.deleteConfirm)) return
    await fetch('/api/me', { method: 'DELETE' })
    router.push('/register')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={save} className="flex flex-col gap-3">
        <label className="text-sm font-medium">{t.common.name}</label>
        <input name="name" defaultValue={user.name} className={inputCls} />

        <label className="text-sm font-medium">{t.auth.courseTrack}</label>
        <select name="courseTrack" defaultValue={user.courseTrack ?? ''} className={inputCls}>
          <option value="">—</option>
          {(['pma', 'gdp', 'navy', 'lcc', 'technical', 'other'] as const).map((k) => (
            <option key={k} value={k}>
              {t.tracks[k]}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium">{t.auth.targetDate}</label>
        <input
          name="targetIssbDate"
          type="date"
          defaultValue={user.targetIssbDate ?? ''}
          className={inputCls}
        />

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            {t.common.save}
          </button>
          {saved && <span className="text-sm text-green-600">{t.common.saved}</span>}
        </div>
      </form>

      <div className="rounded-md border border-neutral-200 p-4 text-sm dark:border-neutral-800">
        <p className="mb-1">
          {user.email} —{' '}
          {user.emailVerified ? (
            <span className="text-green-600">{t.profile.emailVerified}</span>
          ) : (
            <span className="text-amber-600">{t.profile.emailUnverified}</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
        <a
          href="/api/me/export"
          className="w-fit rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
        >
          {t.profile.exportData}
        </a>
        <button
          onClick={deleteAccount}
          className="w-fit rounded-md border border-red-300 px-4 py-2 text-sm text-red-600 dark:border-red-800"
        >
          {t.profile.deleteAccount}
        </button>
      </div>
    </div>
  )
}
