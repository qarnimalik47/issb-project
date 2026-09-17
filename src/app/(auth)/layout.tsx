import { getT } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getT()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
        <a href="/" className="font-semibold">
          {t.common.appName}
        </a>
        <LanguageSwitcher locale={locale} />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </main>
      <footer className="p-4 text-center text-xs text-neutral-500">{t.common.disclaimer}</footer>
    </div>
  )
}
