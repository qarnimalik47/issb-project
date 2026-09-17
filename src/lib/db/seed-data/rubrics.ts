/**
 * Default rubric criteria (generic Officer-Like-Quality dimensions) used to
 * demonstrate the evaluation engine. In production these are authored/validated
 * with the domain expert (backlog Q1) and versioned via the rubric admin tools.
 */
export const DEFAULT_RUBRIC_CRITERIA = [
  { key: 'responsibility', label: 'Sense of responsibility', scale: 5 },
  { key: 'initiative', label: 'Initiative', scale: 5 },
  { key: 'planning', label: 'Planning & organisation', scale: 5 },
  { key: 'emotional_stability', label: 'Emotional stability', scale: 5 },
  { key: 'social_confidence', label: 'Social confidence', scale: 5 },
  { key: 'determination', label: 'Determination', scale: 5 },
  { key: 'expression', label: 'Power of expression', scale: 5 },
]

export const DEFAULT_RUBRIC_OUTPUT_SCHEMA = {
  type: 'object',
  required: ['criteria', 'strengths', 'weaknesses', 'improvement', 'distress'],
  note: 'Each criterion → { score: 1..5, evidence: string }',
}
