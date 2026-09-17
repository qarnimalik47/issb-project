import { db } from '@/lib/db'
import { testTypes } from '@/lib/db/schema/content'
import { eq } from 'drizzle-orm'
import { LecturettePlayer } from '@/components/voice/LecturettePlayer'

export const dynamic = 'force-dynamic'

export default async function LecturettePage() {
  const [tt] = await db.select().from(testTypes).where(eq(testTypes.code, 'lecturette')).limit(1)
  if (!tt) return <p className="text-neutral-500">Lecturette not configured.</p>
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Lecturette</h1>
      <LecturettePlayer testTypeId={tt.id} />
    </div>
  )
}
