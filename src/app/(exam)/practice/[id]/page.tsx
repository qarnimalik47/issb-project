import { notFound, redirect } from 'next/navigation'
import { and, count, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { questionBanks, questions, testTypes } from '@/lib/db/schema/content'
import { getCurrentUser } from '@/lib/auth/session'
import { getT } from '@/lib/i18n'
import { findInProgressAttempt } from '@/lib/tests/attempts'
import { ExamPlayer } from '@/components/exam/ExamPlayer'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function ExamPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ set?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { id } = await params
  const { set } = await searchParams
  // Guard before querying: a malformed id would otherwise surface as a 500.
  if (!UUID_RE.test(id)) notFound()

  const { locale, t } = await getT()
  const [tt] = await db.select().from(testTypes).where(eq(testTypes.id, id)).limit(1)
  if (!tt || tt.scoringType !== 'objective') notFound()

  const timing = (tt.timing ?? {}) as { itemCount?: number; totalSeconds?: number }

  // `?set=` runs one numbered set: a fixed list of questions, so the count is
  // exact rather than the pool-capped estimate the free-practice path shows.
  let setId: string | null = null
  let setTitle: string | null = null
  let questionCount: number

  if (set && UUID_RE.test(set)) {
    const [bank] = await db
      .select({ id: questionBanks.id, title: questionBanks.title, status: questionBanks.status })
      .from(questionBanks)
      .where(and(eq(questionBanks.id, set), eq(questionBanks.testTypeId, id)))
      .limit(1)
    if (!bank || bank.status !== 'published') notFound()
    const [inSet] = await db
      .select({ n: count() })
      .from(questions)
      .where(and(eq(questions.bankId, bank.id), eq(questions.status, 'published')))
    setId = bank.id
    setTitle = bank.title
    questionCount = inSet?.n ?? 0
  } else {
    const [published] = await db
      .select({ n: count() })
      .from(questions)
      .where(and(eq(questions.testTypeId, id), eq(questions.status, 'published')))
    const available = published?.n ?? 0
    questionCount =
      timing.itemCount && timing.itemCount > 0 ? Math.min(timing.itemCount, available) : available
  }

  // Resume straight into the test when one is running — no instructions, no
  // loading flash. An attempt whose time ran out is closed on the way.
  const initialAttempt = await findInProgressAttempt(user.id, id)

  return (
    <ExamPlayer
      test={{
        id,
        code: tt.code,
        name: locale === 'ur' ? tt.nameUr : tt.nameEn,
        questionCount: initialAttempt?.questions.length ?? questionCount,
        totalSeconds: timing.totalSeconds ?? null,
        setId,
        setTitle,
      }}
      initialAttempt={initialAttempt}
      locale={locale}
      t={t.exam}
      disclaimer={t.common.disclaimer}
    />
  )
}
