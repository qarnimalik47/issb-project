import { notFound } from 'next/navigation'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { getCurrentUser } from '@/lib/auth/session'
import { getQuestionForEditor, listTopics } from '@/lib/content/questions'
import { AdminWide } from '@/components/admin/AdminWide'
import { QuestionEditor, type EditableQuestion } from '@/components/admin/QuestionEditor'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()
  const [user, question, types, topics] = await Promise.all([
    getCurrentUser(),
    getQuestionForEditor(id),
    db
      .select({
        id: testTypes.id,
        code: testTypes.code,
        nameEn: testTypes.nameEn,
        scoringType: testTypes.scoringType,
      })
      .from(testTypes)
      .orderBy(asc(testTypes.sortOrder)),
    listTopics(),
  ])
  if (!question) notFound()
  return (
    <AdminWide>
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Edit question
        </h1>
        <QuestionEditor
          key={question.id}
          testTypes={types}
          topics={topics}
          question={question as EditableQuestion}
          canArchive={user?.role === 'admin'}
        />
      </div>
    </AdminWide>
  )
}
