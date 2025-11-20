"use client"

import { useState, useEffect } from "react"
import { Clock, Users, ArrowRight, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { api, type PendingUser, type ApprovalStats } from "@/lib/api"

export function PendingUsersWidget() {
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          api.admin.getPendingUsers(),
          api.admin.getApprovalStats(),
        ])
        setPendingUsers(usersData.slice(0, 5)) // Show only first 5
        setStats(statsData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending User Approvals
          </CardTitle>
          <CardDescription>Review and approve user registration requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending User Approvals
            </CardTitle>
            <CardDescription>Review and approve user registration requests</CardDescription>
          </div>
          {stats && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              {stats.pending}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">No Pending Users</p>
            <p className="text-xs text-muted-foreground">
              All user requests have been processed.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {user.role || "member"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full">
                  View All Pending Users
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

