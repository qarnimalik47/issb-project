import { ProfileInsights } from '@/components/ProfileInsights'

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Your personality insights
      </h1>
      <ProfileInsights />
    </div>
  )
}
