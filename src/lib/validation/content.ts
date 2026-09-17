/**
 * Zod schemas for admin content management, import, and rubrics.
 */
import { z } from 'zod'

export const optionSchema = z.object({
  key: z.string().min(1).max(4),
  textEn: z.string().min(1).max(2000),
  textUr: z.string().max(2000).optional(),
})

export const createQuestionSchema = z.object({
  testTypeId: z.uuid(),
  bankId: z.uuid().optional(),
  stemEn: z.string().min(1).max(4000),
  stemUr: z.string().max(4000).optional(),
  options: z.array(optionSchema).max(8).optional(),
  correctOption: z.string().max(4).optional(),
  explanationEn: z.string().max(4000).optional(),
  explanationUr: z.string().max(4000).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  topic: z.string().max(120).optional(),
})
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>

export const updateQuestionSchema = createQuestionSchema.partial().extend({
  status: z.enum(['draft', 'published', 'archived']).optional(),
})

export const listQuestionsSchema = z.object({
  testTypeId: z.uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  topic: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
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
  action: z.enum(['approve', 'reject']),
})
