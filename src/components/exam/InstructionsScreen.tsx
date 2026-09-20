import { interpolate } from '@/lib/i18n/format'
import { AlertIcon, CheckIcon, ClockIcon } from './icons'
import { btnLarge, btnPrimary, card, eyebrow, kbd } from './ui'
import type { ExamStrings, ExamTest } from './types'

/**
 * Pre-test briefing. The attempt — and therefore the clock — does not exist
 * yet: it is created when the student presses Begin, so reading this page
 * costs no exam time.
 */
export function InstructionsScreen({
  test,
  t,
  starting,
  ready,
  error,
  disclaimer,
  onBegin,
}: {
  test: ExamTest
  t: ExamStrings
  starting: boolean
  /** False until hydration — see useHydrated. */
  ready: boolean
  error: string | null
  disclaimer: string
  onBegin: () => void
}) {
  const timed = test.totalSeconds != null && test.totalSeconds > 0
  const rules = [
    timed ? t.ruleTimer : t.ruleUntimed,
    t.ruleAutosave,
    t.ruleNavigate,
    t.ruleFlag,
    ...(timed ? [t.ruleAutoSubmit] : []),
  ]
  const shortcuts: [string[], string][] = [
    [['A–D', '1–4'], t.shortcutSelect],
    [['F'], t.shortcutFlag],
    [['←', '→'], t.shortcutNavigate],
    [['Enter'], t.shortcutNext],
  ]

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <section className={`${card} overflow-hidden`}>
        <div className="border-b border-line bg-gradient-to-b from-brand-50 to-raised px-10 pt-10 pb-8 dark:from-brand-950/40">
          <p className={eyebrow}>{t.instructions}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{test.name}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-raised px-3 py-1.5 text-ink">
              <span className="font-semibold tabular-nums">
                {interpolate(t.questionCount, { count: test.questionCount })}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-raised px-3 py-1.5 text-ink">
              <ClockIcon className="size-4 text-ink-muted" />
              <span className="font-semibold tabular-nums">
                {timed
                  ? interpolate(t.timeLimit, { minutes: Math.round(test.totalSeconds! / 60) })
                  : t.noTimeLimit}
              </span>
            </span>
          </div>
        </div>

        <div className="grid gap-10 px-10 py-8 md:grid-cols-[1fr_auto]">
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-ink">
                <CheckIcon className="mt-1 size-4 shrink-0 text-brand-600 dark:text-brand-400" />
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>

          <div className="md:min-w-56">
            <h2 className={eyebrow}>{t.shortcutsTitle}</h2>
            <dl className="mt-3 flex flex-col gap-2.5 text-sm">
              {shortcuts.map(([keys, label]) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <dt className="flex gap-1" dir="ltr">
                    {keys.map((k) => (
                      <kbd key={k} className={kbd}>
                        {k}
                      </kbd>
                    ))}
                  </dt>
                  <dd className="m-0 text-ink-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="mx-10 mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            <AlertIcon className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="flex items-center justify-end border-t border-line bg-surface px-10 py-6">
          <button
            type="button"
            onClick={onBegin}
            disabled={starting || !ready}
            className={`${btnPrimary} ${btnLarge} min-w-44`}
          >
            {starting ? t.starting : t.begin}
          </button>
        </div>
      </section>
      <p className="mt-6 text-center text-xs text-ink-muted">{disclaimer}</p>
    </main>
  )
}
