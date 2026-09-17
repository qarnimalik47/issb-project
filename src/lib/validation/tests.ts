import { z } from 'zod'

export const startAttemptSchema = z.object({ testTypeId: z.uuid() })

const answersSchema = z.record(z.string().uuid(), z.string().max(4))

export const autosaveSchema = z.object({
  answers: answersSchema,
  integrityEvent: z
    .object({ type: z.enum(['blur', 'focus', 'hidden', 'visible']), at: z.number().int() })
    .optional(),
})

export const submitAttemptSchema = z.object({ answers: answersSchema })
