import { getT } from '@/lib/i18n'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Wordmark } from '@/components/nav/Wordmark'

/**
 * Split shell: the green panel states what the product is for, the sand side
 * holds the form. On a phone the panel drops away entirely — a candidate
 * signing in on a bus does not need the pitch, they need the two fields.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getT()
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative hidden flex-col justify-between bg-brand-800 p-10 text-brand-50 lg:flex lg:w-[42%] lg:max-w-xl">
        <a href="/" className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] bg-brand-700"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor">
              <path
                d="M3 12.5 10 6l7 6.5"
                className="text-brass-400"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 16.5 10 10l7 6.5"
                className="text-brand-300"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="font-display text-[0.95rem] font-bold tracking-tight text-white">
            {t.common.appName}
          </span>
        </a>

        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-[1.1] font-bold text-white">
            {t.authPanel.title}
          </h2>
          <div className="mt-5 h-0.5 w-12 rounded-pill bg-brass-400" aria-hidden="true" />
          <p className="mt-5 text-brand-100">{t.authPanel.body}</p>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-brand-200">{t.common.disclaimer}</p>
      </aside>

      <div className="field-paper flex flex-1 flex-col">
        <header className="flex items-center justify-between px-5 py-4 lg:justify-end">
          <span className="lg:hidden">
            <Wordmark appName={t.common.appName} href="/" />
          </span>
          <LanguageSwitcher locale={locale} />
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-8">
          <div className="w-full max-w-sm rounded-panel border border-line bg-surface p-7 shadow-card">
            {children}
          </div>
        </main>
        <footer className="px-5 pb-6 text-center text-xs leading-relaxed text-ink-muted lg:hidden">
          {t.common.disclaimer}
        </footer>
      </div>
    </div>
  )
}
