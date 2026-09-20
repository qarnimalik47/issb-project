import { z } from 'zod'

export const startAttemptSchema = z.object({
  testTypeId: z.uuid(),
  /** Run a specific numbered set; omitted means a random sample of the pool. */
  bankId: z.uuid().optional(),
})

const answersSchema = z.record(z.string().uuid(), z.string().max(4))

export const autosaveSchema = z.object({
  answers: answersSchema,
  // Must be declared: the schema is non-strict, so an undeclared `flags` key is
  // silently stripped and flags would appear to save while persisting nothing.
  flags: z.array(z.string().uuid()).max(500).optional(),
  integrityEvent: z
    .object({ type: z.enum(['blur', 'focus', 'hidden', 'visible']), at: z.number().int() })
    .optional(),
})

export const submitAttemptSchema = z.object({ answers: answersSchema })
