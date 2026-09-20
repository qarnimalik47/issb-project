/**
 * The one definition of "a published question is always answerable".
 *
 * Pure (no DB, no Node imports) so the same rules run in three server paths —
 * single publish, bulk publish, import approve-and-publish — and live in the
 * admin editor, which shows the checklist before the author hits Publish.
 * Drafts are deliberately exempt: they may be saved incomplete.
 */

export type ReadinessOption = { key: string; textEn: string; textUr?: string }

export type ReadinessInput = {
  stemEn: string | null | undefined
  options: ReadinessOption[] | null | undefined
  correctOption: string | null | undefined
  /**
   * Objective (MCQ) test types need options and a key. Written/rubric items
   * are a prompt only — a stem is all they need.
   */
  objective: boolean
}

/**
 * Structural problems with an options list plus answer key, independent of
 * publishing. Used by validation too, so "C is the answer but there is no C"
 * is rejected on save, not only at publish time.
 */
export function optionProblems(
  options: ReadinessOption[] | null | undefined,
  correctOption: string | null | undefined,
): string[] {
  const problems: string[] = []
  const keys = (options ?? []).map((o) => o.key.trim())
  if (new Set(keys).size !== keys.length) problems.push('Option keys must be unique')
  if (keys.some((k) => !k)) problems.push('Every option needs a key')
  if (options && correctOption && !keys.includes(correctOption)) {
    problems.push(`The correct answer "${correctOption}" is not one of the options`)
  }
  return problems
}

/** Reasons a question cannot be published yet. An empty list means it can. */
export function publishReadiness(q: ReadinessInput): string[] {
  const reasons: string[] = []
  if (!q.stemEn?.trim()) reasons.push('The English question text is empty')
  if (!q.objective) return reasons

  const options = q.options ?? []
  if (options.length < 2) reasons.push('An MCQ needs at least 2 options')
  if (options.some((o) => !o.textEn.trim())) reasons.push('Every option needs English text')
  if (!q.correctOption) reasons.push('No correct answer is selected')
  reasons.push(...optionProblems(options, q.correctOption))
  return reasons
}
