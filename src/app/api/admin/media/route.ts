/**
 * /api/admin/media — question figures.
 *   GET  → the figure library (?page=). Auth: editor/admin.
 *   POST → upload one image (multipart field `file`). PNG, JPEG or WebP only,
 *          identified by its bytes; 5 MB max. Auth: editor/admin.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { createFigureAsset, listFigures, MAX_FIGURE_BYTES } from '@/lib/content/media'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['content_editor', 'admin'])
  const page = Math.max(1, Number(new URL(req.url).searchParams.get('page')) || 1)
  return json(await listFigures(page))
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  if (!(req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    throw new ApiError('bad_request', 'Upload the image as multipart/form-data')
  }
  // Refuse obviously oversized bodies before buffering them.
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_FIGURE_BYTES + 64 * 1024) {
    throw new ApiError('validation_failed', 'Images must be 5 MB or smaller')
  }
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
  const figure = await createFigureAsset({
    data: Buffer.from(await file.arrayBuffer()),
    filename: file.name,
    userId: admin.id,
  })
  await audit({
    userId: admin.id,
    action: 'content.media.upload',
    targetId: figure.id,
    ip: clientIp(req),
  })
  return json({ figure }, { status: 201 })
})
