import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { eq } from 'drizzle-orm'
import { LecturettePlayer } from '@/components/voice/LecturettePlayer'

export const dynamic = 'force-dynamic'

export default async function LecturettePage() {
  const [tt] = await db.select().from(testTypes).where(eq(testTypes.code, 'lecturette')).limit(1)
  if (!tt) return <p className="text-ink-muted">Lecturette not configured.</p>
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Lecturette
      </h1>
      <LecturettePlayer testTypeId={tt.id} />
    </div>
  )
}
