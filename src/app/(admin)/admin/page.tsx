import type { Metadata } from 'next'
import { OverviewDashboard } from '@/components/admin/OverviewDashboard'

export const metadata: Metadata = { title: 'Dashboard · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <OverviewDashboard />
}
