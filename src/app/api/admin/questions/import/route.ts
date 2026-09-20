/**
 * POST /api/admin/questions/import — bulk-import questions from a CSV or JSON
 * file (multipart: `file`, `dryRun`, `publish`). Dry run is ON unless
 * `dryRun=false` is sent explicitly. Returns a per-row report either way.
 * Auth: editor/admin. One audit row per real import, with the counts.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { runBulkImport } from '@/lib/import/bulk'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_IMPORT_BYTES = 5 * 1024 * 1024

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  if (!(req.headers.get('content-type') ?? '').includes('multipart/form-data')) {
    throw new ApiError('bad_request', 'Upload the file as multipart/form-data')
  }
  const form = await req.formData()
  const file = form.get('file')
  if (!(file instanceof File)) throw new ApiError('bad_request', 'Missing file')
  if (file.size > MAX_IMPORT_BYTES) {
    throw new ApiError('validation_failed', 'Import files must be 5 MB or smaller')
  }

  const content = await file.text()
  const name = file.name.toLowerCase()
  const format = name.endsWith('.json')
    ? 'json'
    : name.endsWith('.csv')
      ? 'csv'
      : content.trimStart().startsWith('[')
        ? 'json'
        : 'csv'
  const dryRun = form.get('dryRun') !== 'false'
  const publish = form.get('publish') === 'true'

  const report = await runBulkImport({ content, format, dryRun, publish, userId: admin.id })
  if (!dryRun) {
    await audit({
      userId: admin.id,
      action: 'content.question.bulk_import',
      ip: clientIp(req),
      metadata: {
        filename: file.name.slice(0, 200),
        format,
        total: report.total,
        created: report.created,
        published: report.published,
        errors: report.errors.length,
        duplicates: report.duplicates.length,
      },
    })
  }
  return json({ report })
})
