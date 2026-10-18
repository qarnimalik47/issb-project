import type { Metadata } from 'next'
import { BillingManager } from '@/components/admin/BillingManager'

export const metadata: Metadata = { title: 'Billing · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <BillingManager />
}
