/**
 * /api/opi — the OPI personality inventory. Auth: required (own sitting only).
 *   GET    → the statements, the answer scale, saved answers and past results.
 *   PUT    → autosave answers ({ answers: { itemId: 1..7 } }).
 *   DELETE → discard the unfinished sitting and start again.
 */
import { z } from 'zod'
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { OPI_ITEMS, OPI_SCALE } from '@/lib/opi/items'
import { getOpiState, restartOpi, saveOpiProgress } from '@/lib/opi/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const answersSchema = z.object({
  answers: z.record(z.string().max(8), z.number().int().min(1).max(7)),
})

export const GET = route(async () => {
  const user = await requireUser()
  const state = await getOpiState(user.id)
  // Trait and keying stay on the server: knowing them makes the test easy to game.
  const items = OPI_ITEMS.map((i) => ({ id: i.id, textEn: i.textEn, textUr: i.textUr }))
  return json({ items, scale: OPI_SCALE, ...state })
})

export const PUT = route(async (req) => {
  const user = await requireUser()
  const { answers } = await readBody(req, answersSchema)
  return json(await saveOpiProgress(user.id, answers))
})

export const DELETE = route(async () => {
  const user = await requireUser()
  await restartOpi(user.id)
  return json({ ok: true })
})
