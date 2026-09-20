/**
 * Zod schemas for admin content management, import, and rubrics.
 */
import { z } from 'zod'
import { optionProblems } from '../content/readiness'

export const optionSchema = z.object({
  key: z.string().min(1).max(4),
  textEn: z.string().max(2000),
  textUr: z.string().max(2000).optional(),
})

const difficultySchema = z.enum(['easy', 'medium', 'hard'])

/**
 * Shared question fields, with no defaults and no refinements: Zod cannot
 * `.partial()` a refined object, and a default inside a partial would silently
 * overwrite the stored value on every PATCH that omits the field.
 */
const questionFields = z.object({
  testTypeId: z.uuid(),
  bankId: z.uuid().optional(),
  stemEn: z.string().min(1).max(4000),
  stemUr: z.string().max(4000).nullable().optional(),
  options: z.array(optionSchema).max(8).nullable().optional(),
  correctOption: z.string().max(4).nullable().optional(),
  explanationEn: z.string().max(4000).nullable().optional(),
  explanationUr: z.string().max(4000).nullable().optional(),
  difficulty: difficultySchema.optional(),
  topic: z.string().max(120).nullable().optional(),
  /** A figure from the media library (required in practice for non-verbal items). */
  mediaId: z.uuid().nullable().optional(),
})

/**
 * Options and key must agree — but only when BOTH are in the payload. Written
 * items carry a stem and no options and must keep validating, and a PATCH that
 * sends only one of the two is re-checked by the route against the stored row
 * (the schema alone cannot see it).
 */
function refineOptions(
  v: { options?: z.infer<typeof optionSchema>[] | null; correctOption?: string | null },
  ctx: z.RefinementCtx,
) {
  if (!v.options) return
  const problems = optionProblems(v.options, v.correctOption ?? null)
  for (const message of problems) {
    ctx.addIssue({ code: 'custom', path: ['options'], message })
  }
}

export const createQuestionSchema = questionFields
  .extend({ difficulty: difficultySchema.default('medium') })
  .superRefine(refineOptions)
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>

export const updateQuestionSchema = questionFields
  .partial()
  .extend({ status: z.enum(['draft', 'published', 'archived']).optional() })
  .superRefine(refineOptions)
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>

export const listQuestionsSchema = z.object({
  testTypeId: z.uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  topic: z.string().max(120).optional(),
  difficulty: difficultySchema.optional(),
  /** Free-text search over the English and Urdu stems. */
  q: z.string().trim().max(200).optional(),
  /** Only questions with no Urdu stem — makes the translation gap visible. */
  missingUrdu: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})
export type ListQuestionsInput = z.infer<typeof listQuestionsSchema>

export const bulkQuestionActionSchema = z.object({
  action: z.enum(['publish', 'unpublish', 'archive']),
  ids: z.array(z.uuid()).min(1).max(500),
})

export const createRubricSchema = z.object({
  testTypeId: z.uuid(),
  name: z.string().min(1).max(200),
  criteria: z
    .array(
      z.object({
        key: z.string().min(1).max(60),
        label: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        scale: z.number().int().min(2).max(10).default(5),
      }),
    )
    .min(1),
  outputSchema: z.record(z.string(), z.unknown()),
})

export const importPathSchema = z.object({
  source: z.literal('path'),
  path: z.string().min(1).max(1000),
  testTypeId: z.uuid().optional(),
})

export const staginReviewSchema = z.object({
  action: z.enum(['approve', 'approve_publish', 'reject']),
})

export const batchUpdateSchema = z.object({ testTypeId: z.uuid() })

/** A reviewer's edit of a staged (imported) question. */
export const stagingEditSchema = z
  .object({
    stemEn: z.string().trim().min(1).max(4000),
    stemUr: z.string().max(4000).nullable().optional(),
    options: z.array(optionSchema).min(2).max(8),
    correctOption: z.string().max(4).nullable(),
    explanation: z.string().max(4000).nullable(),
    explanationUr: z.string().max(4000).nullable().optional(),
  })
  .superRefine(refineOptions)

const licenceSchema = z.enum([
  'public_domain',
  'cc_by',
  'official_sample',
  'owned_licence',
  'third_party_unlicensed',
])

export const createSourceSchema = z.object({
  domain: z.string().trim().min(3).max(253),
  licence: licenceSchema.default('third_party_unlicensed'),
  attribution: z.string().max(300).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  maxPages: z.number().int().min(1).max(200).optional(),
})

export const updateSourceSchema = z.object({
  enabled: z.boolean().optional(),
  tosReviewed: z.boolean().optional(),
  licence: licenceSchema.optional(),
  attribution: z.string().max(300).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  maxPages: z.number().int().min(1).max(200).optional(),
})

export const scrapeRunSchema = z.object({
  urls: z.array(z.string().max(2000)).min(1).max(200),
  testTypeId: z.uuid().nullable().optional(),
})
