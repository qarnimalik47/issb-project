import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { CSV_COLUMNS } from '@/lib/import/bulk'
import { AdminWide } from '@/components/admin/AdminWide'
import { BulkImportPanel } from '@/components/admin/BulkImportPanel'

export const dynamic = 'force-dynamic'

export default async function BulkImportPage() {
  const types = await db
    .select({ code: testTypes.code })
    .from(testTypes)
    .orderBy(asc(testTypes.sortOrder))
  return (
    <AdminWide>
      <div className="flex max-w-4xl flex-col gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Bulk import
          </h1>
          <p className="text-sm text-ink-muted">
            Import questions from a spreadsheet (CSV) or JSON. Every row is checked first; nothing
            is written until you confirm.
          </p>
        </div>
        <BulkImportPanel columns={[...CSV_COLUMNS]} testTypeCodes={types.map((t) => t.code)} />
      </div>
    </AdminWide>
  )
}
