'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { milestoneFor } from '@/lib/tests/exam-format'

type TimerHandlers = {
  /** A spoken milestone (seconds) was crossed. Never fires for 0 — see onExpire. */
  onMilestone: (seconds: number) => void
  /** Time ran out. Fires once. */
  onExpire: () => void
}

/**
 * Seconds left until `deadline` (a client-clock epoch ms), or null when untimed.
 *
 * Anchored to the deadline and recomputed from `Date.now()` on every tick,
 * rather than chaining one-second timeouts: those drift, and background-tab
 * throttling makes them under-count — a student would gain minutes simply by
 * tabbing away. A `visibilitychange` recompute snaps the clock back the moment
 * the tab returns.
 *
 * The deadline is computed from the server's `remainingSeconds` when the
 * attempt arrives, so a skewed client clock cannot shift it.
 */
export function useExamTimer(
  deadline: number | null,
  running: boolean,
  handlers: TimerHandlers,
): { remaining: number | null; resync: () => void } {
  const [now, setNow] = useState(() => Date.now())
  const remaining = deadline == null ? null : Math.max(0, Math.round((deadline - now) / 1000))

  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  })
  const previousRef = useRef<number | null>(remaining)
  const expiredRef = useRef(false)

  useEffect(() => {
    if (deadline == null || !running) return
    function tick() {
      const t = Date.now()
      setNow(t)
      const rem = Math.max(0, Math.round((deadline! - t) / 1000))
      const previous = previousRef.current
      previousRef.current = rem
      if (previous != null) {
        const m = milestoneFor(previous, rem)
        if (m != null && m > 0) handlersRef.current.onMilestone(m)
      }
      if (rem === 0 && !expiredRef.current) {
        expiredRef.current = true
        handlersRef.current.onExpire()
      }
    }
    // Twice a second so the display never lags a visible second behind.
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 500)
    function onVisibility() {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearTimeout(first)
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [deadline, running])

  /** Re-read the clock now — call alongside setting a new deadline. */
  const resync = useCallback(() => setNow(Date.now()), [])
  return { remaining, resync }
}
