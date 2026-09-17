/**
 * PIQ data shape, validation, and persistence.
 */
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { db } from '../db/index'
import { piqProfiles } from '../db/schema/interview'

export const piqSchema = z.object({
  age: z.coerce.number().int().min(14).max(60).optional(),
  education: z.string().max(300).optional(),
  hobbies: z.array(z.string().max(80)).max(15).default([]),
  gamesAndSports: z.array(z.string().max(80)).max(15).default([]),
  positionsOfResponsibility: z.string().max(1000).optional(),
  strengths: z.string().max(1000).optional(),
  weaknesses: z.string().max(1000).optional(),
  whyJoin: z.string().max(2000).optional(),
})
export type Piq = z.infer<typeof piqSchema>

export async function getPiq(userId: string): Promise<Piq | null> {
  const [row] = await db.select().from(piqProfiles).where(eq(piqProfiles.userId, userId)).limit(1)
  return (row?.data as Piq) ?? null
}

export async function savePiq(userId: string, data: Piq): Promise<void> {
  await db
    .insert(piqProfiles)
    .values({ userId, data })
    .onConflictDoUpdate({ target: piqProfiles.userId, set: { data, updatedAt: new Date() } })
}
