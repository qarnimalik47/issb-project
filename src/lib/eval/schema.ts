/**
 * Builds a strict Zod validator for model output from a rubric's criteria.
 * Free-form or malformed output is rejected (rule 1.5). The model must return
 * a score+evidence for EVERY criterion.
 */
import { z } from 'zod'
import type { RubricCriterion } from './prompts'

export type EvaluationOutput = {
  criteria: Record<string, { score: number; evidence: string }>
  strengths: string[]
  weaknesses: string[]
  improvement: string[]
  distress: boolean
}

export function buildOutputSchema(criteria: RubricCriterion[], maxScore: number) {
  const criterionValue = z.object({
    score: z.number().int().min(1).max(maxScore),
    evidence: z.string().min(1).max(4000),
  })
  const required = criteria.map((c) => c.key)
  return z.object({
    // Uniform value type keeps a precise inferred type; superRefine enforces
    // that EVERY rubric criterion is present (free-form/partial output rejected).
    criteria: z.record(z.string(), criterionValue).superRefine((val, ctx) => {
      for (const key of required) {
        if (!(key in val)) {
          ctx.addIssue({ code: 'custom', message: `missing criterion: ${key}` })
        }
      }
    }),
    strengths: z.array(z.string().max(2000)).max(20),
    weaknesses: z.array(z.string().max(2000)).max(20),
    improvement: z.array(z.string().max(2000)).max(20),
    distress: z.boolean(),
  })
}

export function averageScore(out: EvaluationOutput): number {
  const scores = Object.values(out.criteria).map((c) => c.score)
  if (scores.length === 0) return 0
  return scores.reduce((a, b) => a + b, 0) / scores.length
}
