/**
 * /api/admin/picture-stories — the Picture Story (TAT) picture bank.
 *   GET  → every picture with its status and set. Auth: editor/admin.
 *   POST → add one picture (multipart: `file`, `description`, optional
 *          `descriptionUr`, `publish` = "1"). PNG, JPEG or WebP, 5 MB max.
 *          Auth: editor/admin.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { MAX_FIGURE_BYTES } from '@/lib/content/media'
import { createPictureStory, listPictureStories } from '@/lib/content/written-bank'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['content_editor', 'admin'])
  return json({ pictures: await listPictureStories() })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  if (!(req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    throw new ApiError('bad_request', 'Upload the picture as multipart/form-data')
  }
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_FIGURE_BYTES + 64 * 1024) {
    throw new ApiError('validation_failed', 'Images must be 5 MB or smaller')
  }
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
  const picture = await createPictureStory({
    data: Buffer.from(await file.arrayBuffer()),
    filename: file.name,
    description: String(form.get('description') ?? '').slice(0, 1000),
    descriptionUr: String(form.get('descriptionUr') ?? '').slice(0, 1000) || null,
    publish: form.get('publish') === '1',
    userId: admin.id,
  })
  await audit({
    userId: admin.id,
    action: 'content.picture_story.create',
    targetId: picture.id,
    ip: clientIp(req),
  })
  return json({ picture }, { status: 201 })
})
