import type { Metadata } from 'next'
import { IntegrationsManager } from '@/components/admin/IntegrationsManager'

export const metadata: Metadata = { title: 'Integrations · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <IntegrationsManager />
}
