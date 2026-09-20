/**
 * Root layout. Reads the locale cookie and sets <html lang/dir> so Urdu renders
 * right-to-left with an Urdu-capable font (rule: bilingual + RTL from Phase 1).
 */
import type { Metadata, Viewport } from 'next'
import { Noto_Nastaliq_Urdu, Archivo, Public_Sans } from 'next/font/google'
import './globals.css'
import { getLocale } from '@/lib/i18n'
import { dirFor } from '@/lib/i18n/config'

/**
 * globals.css names 'Noto Nastaliq Urdu' in the RTL stack, but nothing was ever
 * loading it — Urdu silently fell back to Segoe UI, which has no Nastaliq forms.
 * Self-hosted by next/font (no runtime request to Google) and only attached to
 * <html> when the locale is Urdu, so English users download nothing.
 */
const urduFont = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-urdu',
  display: 'swap',
})

/**
 * Archivo sets headings: a grotesque with enough weight to carry a page and a
 * squarer, institutional shape than the usual UI sans. Public Sans runs the
 * body and controls — narrower, quieter, and legible at 14px on the mid-range
 * Android screens most candidates use. Both are self-hosted by next/font.
 */
const displayFont = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

const bodyFont = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-public-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ISSB Prep Platform',
  description:
    'Independent practice platform for the ISSB test battery. Not affiliated with ISSB or the Pakistan Armed Forces.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f4ec',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const dir = dirFor(locale)
  const fontVars = [
    displayFont.variable,
    bodyFont.variable,
    locale === 'ur' ? urduFont.variable : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <html
      lang={locale}
      dir={dir}
      data-locale={locale}
      className={fontVars}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-canvas text-ink antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
