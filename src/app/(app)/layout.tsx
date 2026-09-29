import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { SignOutButton } from '@/components/SignOutButton'
import { AppNav, type NavItem } from '@/components/nav/AppNav'
import { Wordmark } from '@/components/nav/Wordmark'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { locale, t } = await getT()

  /* What a candidate touches on a normal study day. */
  const items: NavItem[] = [
    { href: '/practice', label: t.nav.practice },
    { href: '/written', label: t.nav.written },
    { href: '/opi', label: t.nav.opi },
    { href: '/voice', label: t.nav.voice },
    { href: '/gk', label: t.nav.gk },
    { href: '/insights', label: t.nav.insights },
  ]

  const accountItems: NavItem[] = [
    { href: '/dashboard', label: t.common.dashboard },
    { href: '/profile', label: t.common.profile },
    { href: '/simulation', label: t.nav.simulation },
    { href: '/billing', label: t.nav.billing },
    ...(user.role === 'admin' || user.role === 'content_editor'
      ? [{ href: '/admin', label: t.nav.admin }]
      : []),
  ]

  return (
    <div className="field-paper flex min-h-screen flex-col">
      <AppNav
        wordmark={<Wordmark appName={t.common.appName} />}
        items={items}
        accountItems={accountItems}
        userName={user.name}
        accountLabel={t.nav.account}
        menuLabel={t.nav.menu}
        closeMenuLabel={t.nav.closeMenu}
        languageSwitcher={<LanguageSwitcher locale={locale} />}
        signOut={<SignOutButton label={t.common.signOut} />}
      />
      <main className="page-rules mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-12">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8">
        <p className="border-t border-line pt-6 text-center text-xs leading-relaxed text-ink-muted">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  )
}
