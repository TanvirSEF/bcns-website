"use client";

import { UserSectionCards } from "@/components/dashboard/UserSectionCards"
import { UserChartInteractive } from "@/components/dashboard/UserChartInteractive"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { IdCard, Award } from "lucide-react"

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="p-6 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Welcome, {user?.name || "Member"}!
            </h1>
            {user?.membershipType && (
              <Badge variant={user.membershipType === "lifetime" ? "default" : "secondary"} className="capitalize">
                <Award className="h-3 w-3 mr-1" />
                {user.membershipType === "lifetime" ? "Lifetime Member" : "General Member"}
              </Badge>
            )}
          </div>
          <p className="text-gray-700 text-sm md:text-base">
            Track your professional development, connect with fellow members, and stay updated with the latest in child neurology.
          </p>
        </div>

        {user?.memberId && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 rounded-lg border border-emerald-200/80 shadow-xs shrink-0">
            <IdCard className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Member ID</div>
              <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">{user.memberId}</div>
            </div>
          </div>
        )}
      </div>
      
      <UserSectionCards />
      
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <UserChartInteractive />
      </div>
    </div>
  )
}
