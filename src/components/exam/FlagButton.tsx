import { FlagIcon } from './icons'
import { focusRing } from './ui'
import type { ExamStrings } from './types'

/**
 * Flag for review. The label itself says what pressing does next ("Flag for
 * review" / "Remove flag"), so it is not also an aria-pressed toggle — the
 * two together would announce the state twice and contradict each other.
 */
export function FlagButton({
  flagged,
  onToggle,
  t,
}: {
  flagged: boolean
  onToggle: () => void
  t: ExamStrings
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex shrink-0 items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
        flagged
          ? 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200 dark:hover:bg-amber-900/60'
          : 'border-line bg-raised text-ink-muted hover:text-ink'
      }`}
    >
      <FlagIcon className="size-4" filled={flagged} />
      {flagged ? t.unflag : t.flag}
    </button>
  )
}
