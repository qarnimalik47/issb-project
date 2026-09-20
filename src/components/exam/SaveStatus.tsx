import { AlertIcon, CheckIcon } from './icons'
import type { ExamStrings, SaveState } from './types'

/**
 * Quiet autosave indicator. It is not a live region — failures and recovery
 * are announced once through the LiveAnnouncer instead of on every save.
 */
export function SaveStatus({ state, t }: { state: SaveState; t: ExamStrings }) {
  if (state === 'idle') return null
  if (state === 'saving') {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
        <span className="size-2 animate-pulse rounded-full bg-ink-muted" aria-hidden="true" />
        {t.saving}
      </span>
    )
  }
  if (state === 'saved') {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-ink-muted">
        <CheckIcon className="size-4 text-brand-600 dark:text-brand-400" />
        {t.saved}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
      <AlertIcon className="size-4" />
      {state === 'offline' ? t.offline : t.saveFailed}
    </span>
  )
}
