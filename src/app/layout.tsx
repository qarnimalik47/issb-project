/**
 * Root layout. Reads the locale cookie and sets <html lang/dir> so Urdu renders
 * right-to-left with an Urdu-capable font (rule: bilingual + RTL from Phase 1).
 */
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { getLocale } from '@/lib/i18n'
import { dirFor } from '@/lib/i18n/config'

export const metadata: Metadata = {
  title: 'ISSB Prep Platform',
  description:
    'Independent practice platform for the ISSB test battery. Not affiliated with ISSB or the Pakistan Armed Forces.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const dir = dirFor(locale)
  return (
    <html lang={locale} dir={dir} data-locale={locale}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  )
}
