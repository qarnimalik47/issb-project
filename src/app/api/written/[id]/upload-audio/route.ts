/**
 * POST /api/written/[id]/upload-audio — voice mode: upload a recorded answer.
 * Validates size + audio MIME; STT is queued. Auth: required (owner).
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { uploadAudio } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 25 * 1024 * 1024
const ALLOWED = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a']

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const form = await req.formData()
  const ref = String(form.get('ref') ?? '')
  const file = form.get('file')
  const durationSec = Number(form.get('durationSec') ?? 0) || undefined
  if (!ref) throw new ApiError('bad_request', 'Missing item ref')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
  const mime = file.type.split(';')[0] ?? ''
  if (!ALLOWED.includes(mime)) throw new ApiError('bad_request', 'Unsupported audio format')

  const data = Buffer.from(await file.arrayBuffer())
  if (data.length > MAX_BYTES) throw new ApiError('bad_request', 'Recording exceeds 25MB')

  await uploadAudio(user.id, String(id), ref, data, mime, durationSec)
  return json({ ok: true, status: 'stt_queued' }, { status: 202 })
})
