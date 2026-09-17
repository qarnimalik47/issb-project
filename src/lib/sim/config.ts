/**
 * Full Simulation: the psychologist-day battery in the real order (build prompt
 * §6). Each step points to the player for that test type; a consolidated report
 * (the personality profile) is produced after the sequence.
 */
export const PSYCH_DAY_ORDER: { code: string; kind: 'objective' | 'written' }[] = [
  { code: 'verbal', kind: 'objective' },
  { code: 'nonverbal', kind: 'objective' },
  { code: 'mechanical', kind: 'objective' },
  { code: 'wat', kind: 'written' },
  { code: 'sct', kind: 'written' },
  { code: 'picture_story', kind: 'written' },
  { code: 'pointer_story', kind: 'written' },
  { code: 'self_description', kind: 'written' },
  { code: 'srt', kind: 'written' },
  { code: 'essay', kind: 'written' },
]
