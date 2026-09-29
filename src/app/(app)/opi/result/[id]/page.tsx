import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { getOpiResult } from '@/lib/opi/service'
import { ApiError } from '@/lib/api/errors'
import { PageHeader } from '@/components/ui/PageHeader'
import { ButtonLink } from '@/components/ui/Button'
import { OpiReport } from '@/components/opi/OpiReport'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function OpiResultPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()
  const found = await getOpiResult(user.id, id).catch((err: unknown) => {
    if (err instanceof ApiError && err.code === 'not_found') return null
    throw err
  })
  if (!found) notFound()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Your OPI result"
        action={
          <ButtonLink href="/opi" variant="outline">
            Take it again
          </ButtonLink>
        }
      />
      <OpiReport result={found.result} takenAt={found.takenAt} />
    </div>
  )
}
