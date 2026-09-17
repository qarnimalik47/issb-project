/**
 * Server-side i18n helpers. Locale is stored in a cookie and reflected on the
 * <html> element (lang + dir) by the root layout.
 */
import { cookies } from 'next/headers'
import { LOCALE_COOKIE, DEFAULT_LOCALE, isLocale, type Locale } from './config'
import { getDictionary } from './dictionaries'

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const value = store.get(LOCALE_COOKIE)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}

export async function getT() {
  const locale = await getLocale()
  return { locale, t: getDictionary(locale) }
}
