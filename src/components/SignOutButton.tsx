'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SignOutButton({ label }: { label: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  async function signOut() {
    setBusy(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  return (
    <button
      onClick={signOut}
      disabled={busy}
      className="text-sm text-neutral-500 underline hover:text-neutral-900 dark:hover:text-white"
    >
      {label}
    </button>
  )
}
