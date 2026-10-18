import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { listTopics } from '@/lib/content/questions'
import { ScreenHeader } from '@/components/admin/ui/Primitives'
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
    <>
      <ScreenHeader
        title="Question bank"
        lede="Only answerable questions can be published. Drafts may be saved incomplete."
        actions={
          <a
            href="/admin/questions/import"
            className="text-sm font-medium text-brand-600 underline-offset-4 hover:underline dark:text-brand-300"
          >
            Bulk import (CSV / JSON)
          </a>
        }
      />
      <QuestionsManager testTypes={types} topics={topics} />
    </>
  )
}
