import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { getCurrentUser } from '@/lib/auth/session'
import { listTopics } from '@/lib/content/questions'
import { ScreenHeader } from '@/components/admin/ui/Primitives'
import { QuestionEditor } from '@/components/admin/QuestionEditor'

export const dynamic = 'force-dynamic'

export default async function NewQuestionPage() {
  const [user, types, topics] = await Promise.all([
    getCurrentUser(),
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
  return (
    <>
      <ScreenHeader title="New question" />
      <QuestionEditor
        testTypes={types}
        topics={topics}
        question={null}
        canArchive={user?.role === 'admin'}
      />
    </>
  )
}
