"use client"

import * as React from "react"
import { TrendingDown, TrendingUp, Users, Calendar, FileText, BarChart3 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/lib/api"

interface DashboardStats {
  totalUsers: number
  totalEvents: number
  totalDocuments: number
  growth: number
}

export function SectionCards() {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalDocuments: 0,
    growth: 0,
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        // Fetch all stats in parallel
        const [users, events] = await Promise.all([
          api.admin.getAllUsers().catch(() => []),
          api.events.getEvents().catch(() => []),
        ])

        // Calculate total documents from all users
        // Each user has a documents array in their profile
        const totalDocuments = users.reduce((total, user) => {
          const userWithDocs = user as typeof user & { documents?: unknown[] }
          const userDocs = Array.isArray(userWithDocs.documents) ? userWithDocs.documents : []
          return total + userDocs.length
        }, 0)

        // Calculate growth (percentage increase - simplified calculation)
        const totalItems = users.length + events.length + totalDocuments
        const previousTotal = totalItems * 0.9 // Simulated previous period (10% growth)
        const growthPercentage = previousTotal > 0 
          ? Math.round(((totalItems - previousTotal) / previousTotal) * 100)
          : 0

        setStats({
          totalUsers: users.length,
          totalEvents: events.length,
          totalDocuments: totalDocuments,
          growth: growthPercentage,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Users Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalUsers.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Users className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Registered members <Users className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All platform users
          </div>
        </CardFooter>
      </Card>

      {/* Total Events Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEvents.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Calendar className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Scheduled events <Calendar className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All upcoming and past events
          </div>
        </CardFooter>
      </Card>

      {/* Total Documents Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Documents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalDocuments.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <FileText className="size-3" />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Uploaded files <FileText className="size-4" />
          </div>
          <div className="text-muted-foreground">
            All user documents
          </div>
        </CardFooter>
      </Card>

      {/* Growth Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.growth > 0 ? `+${stats.growth}%` : `${stats.growth}%`}
          </CardTitle>
          <CardAction>
            <Badge 
              variant="outline"
              className={
                stats.growth > 0
                  ? "border-green-200 bg-green-50 text-green-700"
                  : stats.growth < 0
                  ? "border-red-200 bg-red-50 text-red-700"
                  : ""
              }
            >
              {stats.growth > 0 ? (
                <TrendingUp className="size-3" />
              ) : stats.growth < 0 ? (
                <TrendingDown className="size-3" />
              ) : (
                <BarChart3 className="size-3" />
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.growth > 0 ? (
              <>Platform growth <TrendingUp className="size-4" /></>
            ) : stats.growth < 0 ? (
              <>Decreased activity <TrendingDown className="size-4" /></>
            ) : (
              <>No change <BarChart3 className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            Overall platform statistics
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
