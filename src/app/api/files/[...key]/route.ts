/**
 * GET /api/files/<key>?exp=&sig= — serve a stored file via a signed, expiring
 * URL. Files live outside the web root and are never served statically
 * (rule 1.3). Access is granted solely by a valid signature.
 */
import { route } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { mediaAssets } from '@/lib/db/schema/content'
import { storage, verifySignedUrl } from '@/lib/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Types served inline. Anything else — notably SVG, HTML and XML, which can
 * carry script and would run on our own origin (stored XSS) — is sent as an
 * opaque download instead.
 */
const INLINE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'audio/webm',
  'audio/ogg',
  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
])

/** Fallback for stored files without a media_assets row (e.g. import PDFs). */
const BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  pdf: 'application/pdf',
}

async function contentTypeFor(key: string): Promise<string | null> {
  const [row] = await db
    .select({ mime: mediaAssets.mime })
    .from(mediaAssets)
    .where(eq(mediaAssets.storageKey, key))
    .limit(1)
  // Recorded mimes may carry parameters ("audio/webm;codecs=opus").
  const recorded = row?.mime.split(';')[0]?.trim().toLowerCase()
  if (recorded) return recorded
  const ext = key.split('.').pop()?.toLowerCase() ?? ''
  return BY_EXTENSION[ext] ?? null
}

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
  const type = await contentTypeFor(key)
  const inline = type !== null && INLINE_TYPES.has(type)
  const filename = (key.split('/').pop() ?? 'file').replace(/["\\\r\n]/g, '')
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'content-type': inline ? type : 'application/octet-stream',
      'content-disposition': `${inline ? 'inline' : 'attachment'}; filename="${filename}"`,
      'x-content-type-options': 'nosniff',
      'cache-control': 'private, max-age=60',
    },
  })
})
