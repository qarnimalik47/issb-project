import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/session'
import { ReviewerClient } from '@/components/reviewer/ReviewerClient'

export default async function ReviewerPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'expert_reviewer' && user.role !== 'admin') redirect('/dashboard')
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Expert reviewer workspace
      </h1>
      <ReviewerClient />
    </div>
  )
}
