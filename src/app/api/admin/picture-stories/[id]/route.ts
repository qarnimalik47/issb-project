/**
 * /api/admin/picture-stories/[id]
 *   PATCH  → edit the description / publish / unpublish. Auth: editor/admin.
 *   DELETE → remove a picture that is not live. Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { updatePictureStorySchema } from '@/lib/validation/written-bank'
import { deletePictureStory, updatePictureStory } from '@/lib/content/written-bank'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function idOf(ctx: { params: Promise<Record<string, string | string[]>> }) {
  const { id } = await ctx.params
  const value = String(id)
  if (!UUID_RE.test(value)) throw new ApiError('not_found', 'Item not found')
  return value
}

export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const id = await idOf(ctx)
  const patch = await readBody(req, updatePictureStorySchema)
  await updatePictureStory(id, patch)
  await audit({
    userId: admin.id,
    action: patch.status ? `content.picture_story.${patch.status}` : 'content.picture_story.update',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ ok: true })
})

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const id = await idOf(ctx)
  await deletePictureStory(id)
  await audit({
    userId: admin.id,
    action: 'content.picture_story.delete',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
