'use client'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { interpolate } from '@/lib/i18n/format'
import type { Locale } from '@/lib/i18n/config'
import { ChevronIcon } from './icons'
import { ProgressBar } from './ProgressBar'
import { SaveStatus } from './SaveStatus'
import { TimerPill } from './TimerPill'
import { btnGhost } from './ui'
import type { ExamStrings, SaveState } from './types'

type LiveProps = {
  answered: number
  total: number
  remaining: number | null
  saveState: SaveState
  onExit: () => void
}

/**
 * The exam's only chrome. Before and after the test it is a plain bar with a
 * way back; during it, progress, autosave state and the clock. The language
 * switcher stays available mid-test: `router.refresh()` keeps client state,
 * so switching EN ⇄ UR loses nothing.
 */
export function ExamTopBar({
  testName,
  t,
  locale,
  live,
}: {
  testName: string
  t: ExamStrings
  locale: Locale
  live?: LiveProps
}) {
  const answeredLabel = live
    ? interpolate(t.answeredOf, { answered: live.answered, total: live.total })
    : ''
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-raised/85 backdrop-blur supports-[backdrop-filter]:bg-raised/70">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
        <div className="flex min-w-0 items-center gap-3">
          {live ? (
            <button type="button" onClick={live.onExit} className={`${btnGhost} -ms-2 px-2`}>
              <ChevronIcon className="size-4 rotate-180 rtl:rotate-0" />
              {t.exit}
            </button>
          ) : (
            <a href="/practice" className={`${btnGhost} -ms-2 px-2`}>
              <ChevronIcon className="size-4 rotate-180 rtl:rotate-0" />
              {t.backToPractice}
            </a>
          )}
          <span className="h-5 w-px bg-line" aria-hidden="true" />
          <span className="truncate font-semibold text-ink">{testName}</span>
        </div>

        {live ? (
          <div className="mx-auto hidden w-full max-w-sm flex-col gap-1.5 md:flex">
            <ProgressBar value={live.answered} max={live.total} label={answeredLabel} />
            <span className="text-center text-xs text-ink-muted">{answeredLabel}</span>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex shrink-0 items-center gap-4">
          {live && <SaveStatus state={live.saveState} t={t} />}
          {live && <TimerPill remaining={live.remaining} t={t} />}
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  )
}
