/**
 * POST /api/opi/submit — score the sitting ({ answers }, merged with what was
 * autosaved). Every statement must be answered. Auth: required.
 */
import { z } from 'zod'
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { submitOpi } from '@/lib/opi/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  answers: z.record(z.string().max(8), z.number().int().min(1).max(7)),
})

export const POST = route(async (req) => {
  const user = await requireUser()
  const { answers } = await readBody(req, schema)
  const { id } = await submitOpi(user.id, answers)
  return json({ id }, { status: 201 })
})
