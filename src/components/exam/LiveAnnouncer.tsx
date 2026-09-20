/**
 * The exam's single screen-reader announcement channel: question changes,
 * autosave failures and recovery, and timer milestones. The visible clock is
 * deliberately NOT live — it updates twice a second and would turn the screen
 * reader into a metronome.
 */
export function LiveAnnouncer({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  )
}
