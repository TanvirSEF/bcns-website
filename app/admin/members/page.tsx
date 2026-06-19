"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "react-toastify"
import {
  Users,
  RefreshCw,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Loader2,
  UserCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/api"
import type { User } from "@/types/api"

export default function MembersPage() {
  const [members, setMembers] = useState<User[]>([])
  const [filteredMembers, setFilteredMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null)
  
  // Pagination State
  const [lifetimePage, setLifetimePage] = useState(1)
  const [generalPage, setGeneralPage] = useState(1)
  const pageSize = 10

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const usersData = await api.admin.getAllUsers({ approvalStatus: 'approved', limit: 0 })
      setMembers([...usersData])
      setFilteredMembers([...usersData])
    } catch (error) {
      console.error("Failed to fetch members:", error)
      toast.error("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = members.filter((member) => {
      return (
        member.name?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query) ||
        member.phone?.toLowerCase().includes(query) ||
        member.affiliation?.toLowerCase().includes(query)
      )
    })
    setFilteredMembers(filtered)
  }, [searchQuery, members])

  // Reset page numbers when search query or members list changes
  useEffect(() => {
    setLifetimePage(1)
    setGeneralPage(1)
  }, [searchQuery, members])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Split members into Lifetime and General tables
  const lifetimeMembers = filteredMembers.filter(
    (m) => m.membershipType === "lifetime"
  )
  const generalMembers = filteredMembers.filter(
    (m) => m.membershipType !== "lifetime"
  )

  // Calculate paginated slices
  const totalLifetimePages = Math.ceil(lifetimeMembers.length / pageSize)
  const totalGeneralPages = Math.ceil(generalMembers.length / pageSize)

  const paginatedLifetimeMembers = lifetimeMembers.slice(
    (lifetimePage - 1) * pageSize,
    lifetimePage * pageSize
  )
  const paginatedGeneralMembers = generalMembers.slice(
    (generalPage - 1) * pageSize,
    generalPage * pageSize
  )

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => {
    if (totalPages <= 1) return null

    return (
      <div className="flex items-center justify-end space-x-2 py-4 border-t px-4 bg-muted/10">
        <div className="flex min-w-[100px] items-center justify-center text-sm font-medium text-muted-foreground mr-4">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const handleMembershipStatusChange = async (
    userId: string,
    membershipStatus: "active" | "inactive"
  ) => {
    setUpdatingMemberId(userId)
    const previousMembers = [...members]
    try {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === userId ? ({ ...m, membershipStatus } as User) : m
        )
      )
      setFilteredMembers((prev) =>
        prev.map((m) =>
          m.id === userId ? ({ ...m, membershipStatus } as User) : m
        )
      )
      await api.admin.updateMembershipStatus(userId, membershipStatus)
      toast.success(
        membershipStatus === "active"
          ? "Membership activated successfully"
          : "Membership deactivated successfully"
      )
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update membership status"
      toast.error(message)
      setMembers(previousMembers)
      setFilteredMembers(previousMembers)
    } finally {
      setUpdatingMemberId(null)
    }
  }

  const MemberRow = ({ member }: { member: User }) => (
    <TableRow key={member.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.profilePictureUrl} />
            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{member.name}</div>
            {member.bio && (
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {member.bio}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{member.phone}</span>
            </div>
          )}
          {member.mailingAddress && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground truncate max-w-[150px]">
                {member.mailingAddress}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {member.affiliation ? (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{member.affiliation}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell>
        {member.membershipType ? (
          <Badge variant={member.membershipType === "lifetime" ? "default" : "secondary"}>
            {member.membershipType === "general" ? "General" : "Lifetime"}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell>
        {member.memberId ? (
          <span className="text-sm font-mono">{member.memberId}</span>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={member.membershipStatus || "inactive"}
          onValueChange={(value) =>
            handleMembershipStatusChange(member.id, value as "active" | "inactive")
          }
          disabled={updatingMemberId === member.id}
        >
          <SelectTrigger
            size="sm"
            className={`w-[115px] ${
              member.membershipStatus === "active"
                ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            }`}
          >
            <span className="flex items-center gap-2">
              {updatingMemberId === member.id && (
                <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
              )}
              <SelectValue placeholder="Status" />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {formatDate(member.createdAt)}
        </div>
      </TableCell>
      <TableCell>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/members/${member.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Members</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all registered members
          </p>
        </div>
        <Button onClick={fetchMembers} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Lifetime Members</p>
              <div className="text-2xl font-bold">{lifetimeMembers.length}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">General Members</p>
              <div className="text-2xl font-bold">{generalMembers.length}</div>
            </div>
          </div>
          {filteredMembers.length !== members.length && (
            <p className="text-sm text-muted-foreground mt-4">
              {filteredMembers.length} filtered from {members.length} total
            </p>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
          <CardDescription>
            Search by name, email, phone, or affiliation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lifetime Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lifetime Members</CardTitle>
          <CardDescription>
            Members with lifetime membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : lifetimeMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No lifetime members found" : "No lifetime members yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Lifetime members will appear here once they register"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Affiliation</TableHead>
                      <TableHead>Membership Type</TableHead>
                      <TableHead>Member ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLifetimeMembers.map((member) => (
                      <MemberRow key={member.id} member={member} />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={lifetimePage}
                totalPages={totalLifetimePages}
                onPageChange={setLifetimePage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* General Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>General Members</CardTitle>
          <CardDescription>
            Members with general (regular) membership
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generalMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No general members found" : "No general members yet"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "General members will appear here once they register"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Affiliation</TableHead>
                      <TableHead>Membership Type</TableHead>
                      <TableHead>Member ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedGeneralMembers.map((member) => (
                      <MemberRow key={member.id} member={member} />
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationControls
                currentPage={generalPage}
                totalPages={totalGeneralPages}
                onPageChange={setGeneralPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

