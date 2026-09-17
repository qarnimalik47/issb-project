/**
 * GET /api/files/<key>?exp=&sig= — serve a stored file via a signed, expiring
 * URL. Files live outside the web root and are never served statically
 * (rule 1.3). Access is granted solely by a valid signature.
 */
import { route } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { NextResponse } from 'next/server'
import { storage, verifySignedUrl } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req, ctx) => {
  const { key: parts } = await ctx.params
  const key = Array.isArray(parts) ? parts.join('/') : String(parts)
  const url = new URL(req.url)
  const exp = url.searchParams.get('exp') ?? ''
  const sig = url.searchParams.get('sig') ?? ''

  if (!verifySignedUrl(key, exp, sig)) {
    throw new ApiError('forbidden', 'Invalid or expired link')
  }
  if (!(await storage.exists(key))) throw new ApiError('not_found', 'File not found')

  const data = await storage.get(key)
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'content-type': 'application/octet-stream',
      'content-disposition': `inline; filename="${key.split('/').pop() ?? 'file'}"`,
      'cache-control': 'private, max-age=60',
    },
  })
})
