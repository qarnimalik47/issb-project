import { ScreenHeader } from '@/components/admin/ui/Primitives'
import { ImportManager } from '@/components/admin/ImportManager'

export default function AdminImportPage() {
  return (
    <div className="max-w-5xl">
      <ScreenHeader
        title="PDF question import"
        lede="Upload a question-bank PDF. Extraction runs in the background; every item must be reviewed and approved before it enters the live bank."
      />
      <ImportManager />
    </div>
  )
}
