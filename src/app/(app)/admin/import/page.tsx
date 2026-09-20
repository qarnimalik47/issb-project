import { ImportManager } from '@/components/admin/ImportManager'

export default function AdminImportPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        PDF Question Import
      </h1>
      <p className="text-sm text-ink-muted">
        Upload a question-bank PDF. Extraction runs in the background; every item must be reviewed
        and approved before it enters the live bank.
      </p>
      <ImportManager />
    </div>
  )
}
