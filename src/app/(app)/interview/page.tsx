import { InterviewClient } from '@/components/interview/InterviewClient'

export default function InterviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Mock interview
      </h1>
      <InterviewClient />
    </div>
  )
}
