import type { Metadata } from 'next'
import { AuditLog } from '@/components/admin/AuditLog'

export const metadata: Metadata = { title: 'Audit log · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <AuditLog />
}
