import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Business dashboard</h1>
      <AdminDashboard />
    </div>
  )
}
