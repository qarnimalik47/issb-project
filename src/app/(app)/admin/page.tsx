import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminHomePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Business dashboard
      </h1>
      <AdminDashboard />
    </div>
  )
}
