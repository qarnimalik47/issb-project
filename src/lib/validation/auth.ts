/**
 * Zod schemas for auth endpoints. Validation happens at the boundary (rule 1.3).
 */
import { z } from 'zod'

export const emailSchema = z
  .email()
  .max(254)
  .transform((v) => v.toLowerCase().trim())

// E.164-ish Pakistani numbers; kept permissive but bounded.
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number')

export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(200)
  .regex(/[A-Za-z]/, 'Include at least one letter')
  .regex(/[0-9]/, 'Include at least one number')

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  locale: z.enum(['en', 'ur']).default('en'),
  courseTrack: z.enum(['pma', 'gdp', 'navy', 'lcc', 'technical', 'other']).optional(),
  targetIssbDate: z.iso.date().optional(),
  acceptTerms: z.literal(true, { error: 'You must accept the terms to register' }),
  consent: z.object({
    storeWritten: z.boolean(),
    storeVoice: z.boolean(),
    storeAssessment: z.boolean(),
  }),
})
export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(200),
})

export const otpRequestSchema = z.object({
  purpose: z.enum(['verify_email', 'verify_phone', 'login', 'password_reset']),
})

export const otpConfirmSchema = z.object({
  purpose: z.enum(['verify_email', 'verify_phone', 'password_reset']),
  code: z.string().regex(/^[0-9]{6}$/, 'Enter the 6-digit code'),
})

export const passwordResetRequestSchema = z.object({ email: emailSchema })

export const passwordResetConfirmSchema = z.object({
  email: emailSchema,
  code: z.string().regex(/^[0-9]{6}$/),
  password: passwordSchema,
})

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  locale: z.enum(['en', 'ur']).optional(),
  courseTrack: z.enum(['pma', 'gdp', 'navy', 'lcc', 'technical', 'other']).optional(),
  targetIssbDate: z.iso.date().nullable().optional(),
})
