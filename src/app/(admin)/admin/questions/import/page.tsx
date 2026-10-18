import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { CSV_COLUMNS } from '@/lib/import/bulk'
import { ScreenHeader } from '@/components/admin/ui/Primitives'
import { BulkImportPanel } from '@/components/admin/BulkImportPanel'

export const dynamic = 'force-dynamic'

export default async function BulkImportPage() {
  const types = await db
    .select({ code: testTypes.code })
    .from(testTypes)
    .orderBy(asc(testTypes.sortOrder))
  return (
    <div className="max-w-4xl">
      <ScreenHeader
        title="Bulk import"
        lede="Import questions from a spreadsheet (CSV) or JSON. Every row is checked first; nothing is written until you confirm."
      />
      <BulkImportPanel columns={[...CSV_COLUMNS]} testTypeCodes={types.map((t) => t.code)} />
    </div>
  )
}
