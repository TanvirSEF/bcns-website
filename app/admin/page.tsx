import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { PendingUsersWidget } from "@/components/admin/PendingUsersWidget"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome to BCNS Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your society&apos;s activities, members, and content from one central location.</p>
      </div>
      
      <SectionCards />
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <ChartAreaInteractive />
        </div>
        <PendingUsersWidget />
      </div>
    </div>
  )
}