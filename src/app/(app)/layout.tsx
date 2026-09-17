import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SignOutButton } from '@/components/SignOutButton'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { locale, t } = await getT()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
        <nav className="flex items-center gap-4 text-sm">
          <a href="/dashboard" className="font-semibold">
            {t.common.appName}
          </a>
          <a
            href="/dashboard"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {t.common.dashboard}
          </a>
          <a
            href="/practice"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Practice
          </a>
          <a
            href="/written"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Written
          </a>
          <a
            href="/insights"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Insights
          </a>
          <a
            href="/simulation"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            Simulation
          </a>
          <a
            href="/profile"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          >
            {t.common.profile}
          </a>
          {(user.role === 'admin' || user.role === 'content_editor') && (
            <a
              href="/admin/import"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              Admin
            </a>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} />
          <SignOutButton label={t.common.signOut} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 p-6">{children}</main>
      <footer className="p-4 text-center text-xs text-neutral-500">{t.common.disclaimer}</footer>
    </div>
  )
}
