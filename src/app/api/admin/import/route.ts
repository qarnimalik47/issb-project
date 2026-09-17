/**
 * /api/admin/import
 *   POST → start a PDF import. Accepts multipart (file upload) or JSON
 *          { source:'path', path }. Auth: editor/admin. Parsing is queued.
 *   GET  → list import batches. Auth: editor/admin.
 */
import { route, requireRole, readBody, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { importPathSchema } from '@/lib/validation/content'
import { createImportBatch } from '@/lib/import/service'
import { db } from '@/lib/db'
import { importBatches } from '@/lib/db/schema/content'
import { desc } from 'drizzle-orm'
import { audit } from '@/lib/audit'
import { readFile } from 'node:fs/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_PDF_BYTES = 25 * 1024 * 1024

function assertPdf(buf: Buffer) {
  // Magic bytes: %PDF
  if (buf.length < 5 || buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new ApiError('bad_request', 'File is not a valid PDF')
  }
  if (buf.length > MAX_PDF_BYTES) {
    throw new ApiError('bad_request', 'PDF exceeds the 25MB limit')
  }
}

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const contentType = req.headers.get('content-type') ?? ''

  let batchId: string
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData()
    const file = form.get('file')
    const testTypeId = (form.get('testTypeId') as string) || undefined
    if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
    const data = Buffer.from(await file.arrayBuffer())
    assertPdf(data)
    batchId = await createImportBatch({
      filename: file.name || 'upload.pdf',
      source: 'upload',
      testTypeId,
      createdBy: admin.id,
      data,
    })
  } else {
    const input = await readBody(req, importPathSchema)
    let data: Buffer
    try {
      data = await readFile(input.path)
    } catch {
      throw new ApiError('bad_request', 'Could not read file at the given path')
    }
    assertPdf(data)
    batchId = await createImportBatch({
      filename: input.path.split('/').pop() ?? 'import.pdf',
      source: 'path',
      testTypeId: input.testTypeId,
      createdBy: admin.id,
      data,
    })
  }

  await audit({
    userId: admin.id,
    action: 'content.import.create',
    targetId: batchId,
    ip: clientIp(req),
  })
  return json({ batchId, status: 'queued' }, { status: 202 })
})

export const GET = route(async () => {
  await requireRole(['content_editor', 'admin'])
  const batches = await db
    .select()
    .from(importBatches)
    .orderBy(desc(importBatches.createdAt))
    .limit(50)
  return json({ batches })
})
