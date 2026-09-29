/**
 * POST /api/admin/planning/map — upload a map / model-room sketch for a
 * planning scenario (multipart field `file`; PNG, JPEG or WebP, 5 MB max).
 * The map is attached when the scenario is saved. Auth: editor/admin.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { MAX_FIGURE_BYTES } from '@/lib/content/media'
import { uploadPlanningMap } from '@/lib/content/written-bank'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  if (!(req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    throw new ApiError('bad_request', 'Upload the map as multipart/form-data')
  }
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_FIGURE_BYTES + 64 * 1024) {
    throw new ApiError('validation_failed', 'Images must be 5 MB or smaller')
  }
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
  const map = await uploadPlanningMap({
    data: Buffer.from(await file.arrayBuffer()),
    filename: file.name,
    userId: admin.id,
  })
  await audit({
    userId: admin.id,
    action: 'content.planning.map_upload',
    targetId: map.id,
    ip: clientIp(req),
  })
  return json({ map }, { status: 201 })
})
