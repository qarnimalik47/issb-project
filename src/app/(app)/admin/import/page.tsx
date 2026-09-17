import { ImportManager } from '@/components/admin/ImportManager'

export default function AdminImportPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">PDF Question Import</h1>
      <p className="text-sm text-neutral-500">
        Upload a question-bank PDF. Extraction runs in the background; every item must be reviewed
        and approved before it enters the live bank.
      </p>
      <ImportManager />
    </div>
  )
}
