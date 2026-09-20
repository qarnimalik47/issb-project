import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { listTopics } from '@/lib/content/questions'
import { AdminWide } from '@/components/admin/AdminWide'
import { QuestionsManager } from '@/components/admin/QuestionsManager'

export const dynamic = 'force-dynamic'

export default async function AdminQuestionsPage() {
  const [types, topics] = await Promise.all([
    db
      .select({ id: testTypes.id, code: testTypes.code, nameEn: testTypes.nameEn })
      .from(testTypes)
      .orderBy(asc(testTypes.sortOrder)),
    listTopics(),
  ])
  return (
    <AdminWide>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Question bank
            </h1>
            <p className="text-sm text-ink-muted">
              Only answerable questions can be published. Drafts may be saved incomplete.
            </p>
          </div>
          <a href="/admin/questions/import" className="text-sm font-medium underline">
            Bulk import (CSV / JSON)
          </a>
        </div>
        <QuestionsManager testTypes={types} topics={topics} />
      </div>
    </AdminWide>
  )
}
