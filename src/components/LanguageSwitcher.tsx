'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import type { Locale } from '@/lib/i18n/config'

/**
 * Toggles the UI language (English ⇄ Urdu). Persists via /api/locale then
 * refreshes so the server re-renders with the new locale and direction.
 */
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  async function setLocale(next: Locale) {
    await fetch('/api/locale', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ locale: next }),
    })
    startTransition(() => router.refresh())
  }

  return (
    <div className="inline-flex items-center gap-1 text-sm" aria-label="Language">
      <button
        type="button"
        disabled={pending || locale === 'en'}
        onClick={() => setLocale('en')}
        className={`rounded px-2 py-1 ${locale === 'en' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
      >
        EN
      </button>
      <button
        type="button"
        disabled={pending || locale === 'ur'}
        onClick={() => setLocale('ur')}
        className={`rounded px-2 py-1 ${locale === 'ur' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}
      >
        اردو
      </button>
    </div>
  )
}
