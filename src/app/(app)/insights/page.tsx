import { ProfileInsights } from '@/components/ProfileInsights'

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Your personality insights</h1>
      <ProfileInsights />
    </div>
  )
}
