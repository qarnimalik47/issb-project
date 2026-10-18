import type { Metadata } from 'next'
import { ApiKeysManager } from '@/components/admin/ApiKeysManager'

export const metadata: Metadata = { title: 'API keys · Admin' }
export const dynamic = 'force-dynamic'

export default function Page() {
  return <ApiKeysManager />
}
