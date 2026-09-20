import { z } from 'zod'

export const startWrittenSchema = z.object({
  testTypeId: z.uuid(),
  mode: z.enum(['typed', 'paper']).default('typed'),
  /** Run a specific numbered set; omitted means the whole published pool. */
  bankId: z.uuid().optional(),
})

export const saveWrittenSchema = z.object({
  ref: z.string().max(20),
  text: z.string().max(20000),
  timingMeta: z.record(z.string(), z.number()).optional(),
})

export const confirmOcrSchema = z.object({
  ref: z.string().max(20),
  text: z.string().max(20000),
})
