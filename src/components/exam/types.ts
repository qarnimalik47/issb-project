/**
 * Client-side shapes for the MCQ exam player. The attempt and result types are
 * the server's own (type-only imports are erased, so no server code ships to
 * the browser) — one definition instead of a hand-copied duplicate that drifts.
 */
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { AttemptResult, PlayerAttempt, PlayerQuestion } from '@/lib/tests/attempts'

export type ExamStrings = Dictionary['exam']
export type ExamAttempt = PlayerAttempt
export type ExamQuestion = PlayerQuestion
export type ExamResult = AttemptResult
export type ExamResultItem = AttemptResult['items'][number]
export type ExamOption = NonNullable<PlayerQuestion['options']>[number]

/** What the player needs to know about the test before an attempt exists. */
export type ExamTest = {
  id: string
  code: string
  name: string
  /** Questions in one set (the item count, capped by what is published). */
  questionCount: number
  totalSeconds: number | null
  /** The numbered set being run, when the player was entered from the set list. */
  setId?: string | null
  /** Its label ("Test 3"), shown alongside the test name. */
  setTitle?: string | null
}

export type Phase = 'instructions' | 'starting' | 'active' | 'review' | 'submitting' | 'result'

export type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'offline'
