/**
 * Pure presentation helpers for the MCQ exam player.
 *
 * Deliberately free of React and of any Node-only import so the whole module is
 * unit-testable in the default vitest (node) environment. Everything the player
 * renders that involves a decision — what a question's status is, which tone the
 * clock takes, whether a spoken milestone is due — is decided here rather than
 * inline in JSX, so it can be tested without mounting a component.
 */

/** Clock display. Always LTR, always mm:ss (or h:mm:ss past an hour). */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`
}

/** Display letter for the nth option, used when a question omits explicit keys. */
export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index)
}

export type QuestionStatus = 'current' | 'flagged' | 'answered' | 'blank'

/**
 * Status of a single question in the navigator.
 *
 * Precedence matters: `current` wins so the student never loses their place,
 * then `flagged` (an explicit "come back here" beats the incidental fact that
 * something is typed in), then `answered`.
 */
export function questionStatus(input: {
  current: boolean
  flagged: boolean
  answered: boolean
}): QuestionStatus {
  if (input.current) return 'current'
  if (input.flagged) return 'flagged'
  if (input.answered) return 'answered'
  return 'blank'
}

export type ExamCounts = {
  total: number
  answered: number
  unanswered: number
  flagged: number
}

export function counts(
  questionIds: string[],
  answers: Record<string, string>,
  flags: Iterable<string>,
): ExamCounts {
  const flagSet = flags instanceof Set ? flags : new Set(flags)
  let answered = 0
  let flagged = 0
  for (const id of questionIds) {
    // An empty string is "cleared", not "answered" — matches scoreMcq, which
    // treats '' and null identically.
    if (answers[id]) answered += 1
    if (flagSet.has(id)) flagged += 1
  }
  return {
    total: questionIds.length,
    answered,
    unanswered: questionIds.length - answered,
    flagged,
  }
}

export type TimerTone = 'normal' | 'warning' | 'danger'

/**
 * Visual urgency of the clock. Thresholds are absolute rather than proportional
 * so a 15-minute test and a 30-minute test both turn red with a minute to go.
 */
export function timerTone(remainingSeconds: number): TimerTone {
  if (remainingSeconds <= 60) return 'danger'
  if (remainingSeconds <= 300) return 'warning'
  return 'normal'
}

/** Milestones announced to screen readers, in seconds. */
export const TIMER_MILESTONES = [600, 300, 60, 30, 0] as const

/**
 * The milestone crossed when the clock moved from `previous` to `current`, or
 * null. Compares across the pair rather than testing equality so a tick that
 * skips a value — a throttled background tab, a slow frame — still announces.
 * Only ever fires once per boundary.
 */
export function milestoneFor(previous: number, current: number): number | null {
  if (current >= previous) return null
  for (const m of TIMER_MILESTONES) {
    if (previous > m && current <= m) return m
  }
  return null
}

/**
 * Display form of a topic slug: "number-series" → "Number series". Topics are
 * open-ended admin data, so they cannot live in the dictionaries; this keeps
 * weak-topic chips readable instead of showing raw slugs.
 */
export function humanizeTopic(slug: string): string {
  const words = slug.trim().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : ''
}
