/**
 * Zod schemas for the Picture Story and Group Planning admin sections.
 */
import { z } from 'zod'

const status = z.enum(['draft', 'published', 'archived'])

export const updatePictureStorySchema = z
  .object({
    description: z.string().max(1000).optional(),
    descriptionUr: z.string().max(1000).nullable().optional(),
    status: status.optional(),
  })
  .strict()

const line = z.string().max(1000)

export const planningSchema = z
  .object({
    titleEn: z.string().max(200),
    titleUr: z.string().max(200).nullable().optional(),
    narrativeEn: z.string().max(8000),
    narrativeUr: z.string().max(8000).nullable().optional(),
    problems: z.array(line).max(12),
    modelPlan: z.array(line).max(20),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    status,
    mapMediaId: z.string().uuid().nullable(),
  })
  .strict()
