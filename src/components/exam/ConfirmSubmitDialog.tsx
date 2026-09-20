'use client'

import { useEffect, useRef } from 'react'
import { interpolate } from '@/lib/i18n/format'
import { AlertIcon, FlagIcon } from './icons'
import { btnPrimary, btnSecondary } from './ui'
import type { ExamStrings } from './types'

/**
 * "Submit with questions left?" — only ever opened when something is blank or
 * flagged; a clean paper submits straight away.
 *
 * Native `<dialog>` + `showModal()` provides the focus trap, Escape to close
 * and focus restoration without a library. The confirm button reads "Submit
 * test", distinct from the review screen's "Submit", so the two never collide.
 */
export function ConfirmSubmitDialog({
  open,
  unanswered,
  flagged,
  t,
  onConfirm,
  onClose,
}: {
  open: boolean
  unanswered: number
  flagged: number
  t: ExamStrings
  onConfirm: () => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="confirm-submit-title"
      className="m-auto w-full max-w-md rounded-card border border-line bg-raised p-0 text-ink shadow-raised"
    >
      <div className="px-7 pt-7 pb-5">
        <h2 id="confirm-submit-title" className="text-xl font-semibold tracking-tight">
          {t.confirmTitle}
        </h2>
        <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0 text-sm">
          {unanswered > 0 && (
            <li className="flex items-center gap-2">
              <AlertIcon className="size-4 text-amber-600" />
              {interpolate(t.confirmUnanswered, { count: unanswered })}
            </li>
          )}
          {flagged > 0 && (
            <li className="flex items-center gap-2">
              <FlagIcon className="size-4 text-amber-600" filled />
              {interpolate(t.confirmFlagged, { count: flagged })}
            </li>
          )}
        </ul>
        <p className="mt-4 text-sm text-ink-muted">{t.confirmBody}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-line bg-surface px-7 py-4">
        <button type="button" onClick={onClose} className={btnSecondary} autoFocus>
          {t.keepWorking}
        </button>
        <button type="button" onClick={onConfirm} className={btnPrimary}>
          {t.submitTest}
        </button>
      </div>
    </dialog>
  )
}
