import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function HomePage() {
  if (await getCurrentUser()) redirect('/dashboard')
  const { locale, t } = await getT()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
        <span className="font-semibold">{t.common.appName}</span>
        <LanguageSwitcher locale={locale} />
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">{t.common.appName}</h1>
        <div className="flex gap-3">
          <a
            href="/register"
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
          >
            {t.common.register}
          </a>
          <a
            href="/login"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium dark:border-neutral-700"
          >
            {t.common.signIn}
          </a>
        </div>
        <p className="rounded-lg border border-neutral-200 p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          {t.common.disclaimer}
        </p>
      </main>
    </div>
  )
}
