"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import {
  UserCheck,
  Trash2,
  RefreshCw,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  Eye
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { api, type PendingUser, type ApprovalStats } from "@/lib/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ApproveUserDialog } from "@/components/admin/ApproveUserDialog"
import { UserDetailsDialog } from "@/components/admin/UserDetailsDialog"

export default function UsersPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [stats, setStats] = useState<ApprovalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersData, statsData] = await Promise.all([
        api.admin.getPendingUsers(),
        api.admin.getApprovalStats(),
      ])
      setPendingUsers([...usersData])
      setStats(statsData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApproveClick = (user: PendingUser) => {
    setSelectedUser(user)
    setApproveDialogOpen(true)
  }

  const handleDetailsClick = (user: PendingUser) => {
    setSelectedUser(user)
    setDetailsDialogOpen(true)
  }

  const handleApproveConfirm = async (memberId: string, adminNotes?: string) => {
    if (!selectedUser) return

    try {
      setActionLoading(selectedUser.id)
      await api.admin.approveUser(selectedUser.id, memberId, adminNotes)
      toast.success(`User ${selectedUser.name} approved successfully with Member ID: ${memberId}`)
      setApproveDialogOpen(false)
      setSelectedUser(null)
      await fetchData()
    } catch (error) {
      console.error("Failed to approve user:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to approve user"
      toast.error(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteClick = (user: PendingUser) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(selectedUser.id)
      await api.admin.deleteUser(selectedUser.id)
      toast.success(`User ${selectedUser.name} deleted successfully`)
      setDeleteDialogOpen(false)
      setSelectedUser(null)
      await fetchData()
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error("Failed to delete user")
    } finally {
      setActionLoading(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user approval requests and review pending applications
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending User Approvals</CardTitle>
          <CardDescription>
            Review and manage user registration requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Users</h3>
              <p className="text-sm text-muted-foreground">
                All user requests have been processed.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profilePictureUrl} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            {user.bio && (
                              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {user.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role || "member"}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDetailsClick(user)}
                            className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
                            title="View full details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApproveClick(user)}
                            disabled={actionLoading === user.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(user)}
                            disabled={actionLoading === user.id}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
              This will permanently delete the user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSelectedUser(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={actionLoading === selectedUser?.id}
            >
              {actionLoading === selectedUser?.id ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve User Dialog */}
      <ApproveUserDialog
        user={selectedUser}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onConfirm={handleApproveConfirm}
        loading={actionLoading === selectedUser?.id}
      />

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </div>
  )
}
