import { PiqBuilder } from '@/components/interview/PiqBuilder'

export default function PiqPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Personal Information Questionnaire (PIQ)
      </h1>
      <p className="text-sm text-ink-muted">
        Your PIQ powers the mock interview and a consistency check against your written tests. Be
        accurate and honest.
      </p>
      <PiqBuilder />
    </div>
  )
}
