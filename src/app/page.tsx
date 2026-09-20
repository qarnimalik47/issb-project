import { redirect } from 'next/navigation'
import { getT } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Wordmark } from '@/components/nav/Wordmark'
import { ButtonLink } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function HomePage() {
  if (await getCurrentUser()) redirect('/dashboard')
  const { locale, t } = await getT()
  const l = t.landing

  return (
    <div className="field-paper flex min-h-screen flex-col">
      <header className="sticky top-3 z-40 mx-auto w-full max-w-6xl px-4">
        <div className="flex items-center gap-3 rounded-panel border border-line bg-surface/85 px-3 py-2 shadow-nav backdrop-blur-md">
          <Wordmark appName={t.common.appName} href="/" />
          <div className="ms-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} />
            </div>
            <ButtonLink href="/login" variant="ghost" size="sm">
              {t.common.signIn}
            </ButtonLink>
            <ButtonLink href="/register" size="sm">
              {t.common.register}
            </ButtonLink>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <section className="py-16 sm:py-24">
          <h1 className="max-w-4xl font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-ink sm:text-6xl">
            {l.title}
          </h1>
          <div className="mt-7 h-0.5 w-14 rounded-pill bg-brass-500" aria-hidden="true" />
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">{l.body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/register" size="lg">
              {t.common.register}
            </ButtonLink>
            <ButtonLink href="/login" variant="outline" size="lg">
              {t.common.signIn}
            </ButtonLink>
          </div>
        </section>

        {/* The five days are a fixed sequence, so they are drawn as one — a
            single rail the stages sit on, rather than five separate cards. */}
        <section className="pb-16 sm:pb-24">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            {l.stagesTitle}
          </h2>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {l.stages.map((stage, i) => (
              <li key={stage.name} className="flex flex-col gap-2 bg-surface p-5">
                <div className="flex items-center gap-2">
                  <span
                    className="font-display text-sm font-bold tabular-nums text-brass-600"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </div>
                <h3 className="font-display leading-snug font-semibold text-ink">{stage.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{stage.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pb-16 sm:pb-24">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">
            {l.featuresTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {l.features.map((f) => (
              <Card key={f.name} className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">{f.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{f.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-10">
        <p className="border-t border-line pt-6 text-xs leading-relaxed text-ink-muted">
          {t.common.disclaimer}
        </p>
      </footer>
    </div>
  )
}
