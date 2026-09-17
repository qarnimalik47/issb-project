import { FlashcardReview } from '@/components/gk/FlashcardReview'

export default function FlashcardsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Flashcards</h1>
      <FlashcardReview />
    </div>
  )
}
