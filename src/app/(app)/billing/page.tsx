import { Suspense } from 'react'
import { BillingClient } from '@/components/billing/BillingClient'

export default function BillingPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Plans &amp; billing
      </h1>
      <Suspense fallback={null}>
        <BillingClient />
      </Suspense>
    </div>
  )
}
