/**
 * POST /api/written/[id]/upload — paper mode: upload an answer-sheet photo.
 * Validates MIME + magic bytes + size; OCR is queued. Auth: required (owner).
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { uploadAnswerSheet } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 10 * 1024 * 1024

function detectImage(buf: Buffer): string | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return 'image/png'
  return null
}

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const form = await req.formData()
  const ref = String(form.get('ref') ?? '')
  const file = form.get('file')
  if (!ref) throw new ApiError('bad_request', 'Missing item ref')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')

  const data = Buffer.from(await file.arrayBuffer())
  if (data.length > MAX_BYTES) throw new ApiError('bad_request', 'Image exceeds 10MB')
  const mime = detectImage(data)
  if (!mime) throw new ApiError('bad_request', 'Only JPEG or PNG images are accepted')

  await uploadAnswerSheet(user.id, String(id), ref, data, mime)
  return json({ ok: true, status: 'ocr_queued' }, { status: 202 })
})
