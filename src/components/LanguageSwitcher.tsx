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
    <div
      className="inline-flex items-center gap-0.5 rounded-pill bg-sunk p-0.5 text-sm"
      aria-label="Language"
    >
      <button
        type="button"
        disabled={pending || locale === 'en'}
        onClick={() => setLocale('en')}
        className={`rounded-pill px-2.5 py-1 font-medium transition-colors ${locale === 'en' ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'}`}
      >
        EN
      </button>
      <button
        type="button"
        disabled={pending || locale === 'ur'}
        onClick={() => setLocale('ur')}
        className={`rounded-pill px-2.5 py-1 font-medium transition-colors ${locale === 'ur' ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'}`}
      >
        اردو
      </button>
    </div>
  )
}
