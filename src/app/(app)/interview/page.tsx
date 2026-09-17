import { InterviewClient } from '@/components/interview/InterviewClient'

export default function InterviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Mock interview</h1>
      <InterviewClient />
    </div>
  )
}
