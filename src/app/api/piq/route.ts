/** /api/piq — GET or PUT the user's PIQ. Auth: required. */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { piqSchema, getPiq, savePiq } from '@/lib/interview/piq'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const user = await requireUser()
  return json({ piq: await getPiq(user.id) })
})

export const PUT = route(async (req) => {
  const user = await requireUser()
  const data = await readBody(req, piqSchema)
  await savePiq(user.id, data)
  await audit({ userId: user.id, action: 'piq.save' })
  return json({ ok: true })
})
