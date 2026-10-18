import type { Metadata } from 'next'
import { SystemPanel } from '@/components/admin/SystemPanel'

export const metadata: Metadata = { title: 'System · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <SystemPanel />
}
