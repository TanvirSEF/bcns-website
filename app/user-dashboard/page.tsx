import { UserSectionCards } from "@/components/dashboard/UserSectionCards"
import { UserChartInteractive } from "@/components/dashboard/UserChartInteractive"

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900">Welcome to Your BCNS Dashboard</h1>
        <p className="text-gray-700">Track your professional development, connect with fellow members, and stay updated with the latest in child neurology.</p>
      </div>
      
      <UserSectionCards />
      
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <UserChartInteractive />
      </div>
    </div>
  )
}
