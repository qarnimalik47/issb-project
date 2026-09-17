/**
 * SM-2 spaced-repetition algorithm (build prompt §4.5). Proper implementation
 * with per-card state; pure and exhaustively unit-testable. Grades are 0..5
 * (0 = total blackout, 5 = perfect recall).
 */
export type Sm2State = {
  repetitions: number
  intervalDays: number
  easiness: number // >= 1.3
}

export type Sm2Review = Sm2State & { nextIntervalDays: number }

export const INITIAL_SM2: Sm2State = { repetitions: 0, intervalDays: 0, easiness: 2.5 }

/** Apply a review grade and return the updated state + next interval (days). */
export function reviewCard(state: Sm2State, quality: number): Sm2Review {
  const q = Math.max(0, Math.min(5, Math.round(quality)))

  // Update easiness factor (bounded at 1.3).
  const easiness = Math.max(
    1.3,
    Number((state.easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))).toFixed(4)),
  )

  let repetitions: number
  let intervalDays: number

  if (q < 3) {
    // Failed recall → restart the repetition cycle, review again tomorrow.
    repetitions = 0
    intervalDays = 1
  } else {
    repetitions = state.repetitions + 1
    if (repetitions === 1) intervalDays = 1
    else if (repetitions === 2) intervalDays = 6
    else intervalDays = Math.round(state.intervalDays * easiness)
  }

  return { repetitions, intervalDays, easiness, nextIntervalDays: intervalDays }
}

/** Compute the next due timestamp (ms) from a review, given "now". */
export function nextDueAt(nowMs: number, intervalDays: number): number {
  return nowMs + intervalDays * 24 * 60 * 60 * 1000
}
