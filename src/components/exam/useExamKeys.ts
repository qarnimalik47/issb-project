'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n/config'

type KeyHandlers = {
  /** 0-based option index. */
  select: (index: number) => void
  flag: () => void
  previous: () => void
  next: () => void
  /** Enter: the screen's primary action (next question, or review on the last). */
  primary: () => void
}

/**
 * Exam keyboard shortcuts: A–H / 1–8 choose, F flags, Enter advances, and the
 * horizontal arrows move between questions.
 *
 * Arrows are direction-aware — "forward" is ArrowLeft in Urdu — and are
 * `preventDefault`ed. Native radio groups also move the selection on
 * Left/Right, so without that, arrowing to the next question while an option
 * has focus would silently change the answer. Up/Down stay native inside the
 * option group.
 */
export function useExamKeys(enabled: boolean, locale: Locale, handlers: KeyHandlers) {
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  })

  useEffect(() => {
    if (!enabled) return
    const forward = locale === 'ur' ? 'ArrowLeft' : 'ArrowRight'
    const back = locale === 'ur' ? 'ArrowRight' : 'ArrowLeft'

    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return
      if (tag === 'INPUT' && (target as HTMLInputElement).type !== 'radio') return
      const h = handlersRef.current

      if (e.key === forward || e.key === back) {
        e.preventDefault()
        if (e.key === forward) h.next()
        else h.previous()
        return
      }
      if (e.key === 'Enter') {
        // A focused button or link already activates on Enter.
        if (tag === 'BUTTON' || tag === 'A') return
        e.preventDefault()
        h.primary()
        return
      }
      const key = e.key.toLowerCase()
      if (key === 'f') {
        e.preventDefault()
        h.flag()
        return
      }
      const letter = 'abcdefgh'.indexOf(key)
      const digit = '12345678'.indexOf(key)
      const index = letter >= 0 ? letter : digit
      if (index >= 0) {
        e.preventDefault()
        h.select(index)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, locale])
}
