import { notFound } from 'next/navigation'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { getCurrentUser } from '@/lib/auth/session'
import { getQuestionForEditor, listTopics } from '@/lib/content/questions'
import { ScreenHeader } from '@/components/admin/ui/Primitives'
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
    <>
      <ScreenHeader title="Edit question" />
      <QuestionEditor
        key={question.id}
        testTypes={types}
        topics={topics}
        question={question as EditableQuestion}
        canArchive={user?.role === 'admin'}
      />
    </>
  )
}
