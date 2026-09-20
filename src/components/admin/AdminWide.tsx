/**
 * Lets an admin page use desktop width. The app shell centres content in a
 * narrow reading column (max-w-3xl) that suits student pages but cramps a
 * question table or editor; this breaks out of it symmetrically, capped so it
 * never exceeds the viewport.
 */
export function AdminWide({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative left-1/2 w-[min(76rem,calc(100vw-3rem))] -translate-x-1/2">
      {children}
    </div>
  )
}
