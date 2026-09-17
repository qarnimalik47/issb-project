/**
 * Localisation config. The product is bilingual (English/Urdu) with RTL for
 * Urdu from Phase 1 (not bolted on later).
 */
export const LOCALES = ['en', 'ur'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'issb_locale'

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ur' ? 'rtl' : 'ltr'
}

export function isLocale(v: string | undefined): v is Locale {
  return v === 'en' || v === 'ur'
}
