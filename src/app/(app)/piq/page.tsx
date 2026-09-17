import { PiqBuilder } from '@/components/interview/PiqBuilder'

export default function PiqPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Personal Information Questionnaire (PIQ)</h1>
      <p className="text-sm text-neutral-500">
        Your PIQ powers the mock interview and a consistency check against your written tests. Be
        accurate and honest.
      </p>
      <PiqBuilder />
    </div>
  )
}
