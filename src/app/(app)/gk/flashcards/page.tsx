import { FlashcardReview } from '@/components/gk/FlashcardReview'
import { PageHeader } from '@/components/ui/PageHeader'

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Flashcards"
        lede="Cards are generated from every topic you can read. Grade yourself honestly — the schedule only works if you do."
      />
      <FlashcardReview />
    </div>
  )
}
