"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Download, Eye, Clock, User, Globe, Monitor, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { ActivityLog } from "@/types/api";
import { getActivityLogs } from "@/lib/api";

export default function ActivityLogsManagement() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getActivityLogs();
      setLogs([...response]);
    } catch (error) {
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = useCallback(() => {
    let filtered = [...logs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(log =>
        (log.action || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.userEmail || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== "all") {
      filtered = filtered.filter(log => (log.action || "unknown") === actionFilter);
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter(log => (log.userId || "unknown") === userFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const logDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filtered = filtered.filter(log => {
            if (!log.createdAt) return false;
            logDate.setTime(Date.parse(log.createdAt));
            return logDate.toDateString() === now.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => {
            if (!log.createdAt) return false;
            logDate.setTime(Date.parse(log.createdAt));
            return logDate >= weekAgo;
          });
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(log => {
            if (!log.createdAt) return false;
            logDate.setTime(Date.parse(log.createdAt));
            return logDate >= monthAgo;
          });
          break;
      }
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [logs, searchQuery, actionFilter, userFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedLogs = filteredLogs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const getActionBadge = (action: string) => {
    const actionColors: { [key: string]: string } = {
      login: "bg-blue-100 text-blue-800",
      logout: "bg-gray-100 text-gray-800",
      create_event: "bg-green-100 text-green-800",
      update_event: "bg-yellow-100 text-yellow-800",
      delete_event: "bg-red-100 text-red-800",
      delete_poll: "bg-red-100 text-red-800",
      delete_publication: "bg-red-100 text-red-800",
      upload_document: "bg-purple-100 text-purple-800",
      update_profile: "bg-indigo-100 text-indigo-800",
      register_event: "bg-teal-100 text-teal-800",
    };

    const sanitizedAction = action || "unknown";

    return (
      <Badge className={actionColors[sanitizedAction] || "bg-gray-100 text-gray-800"}>
        {sanitizedAction.replace(/_/g, " ")}
      </Badge>
    );
  };

  const getUniqueActions = () => {
    const actions = [...new Set(logs.map(log => log.action || "unknown"))];
    return actions.sort();
  };

  const getUniqueUsers = () => {
    const users = logs.reduce((acc, log) => {
      const userId = log.userId || "unknown";
      const userEmail = log.userEmail || "System/Unknown";
      if (!acc.find(u => u.id === userId)) {
        acc.push({ id: userId, email: userEmail });
      }
      return acc;
    }, [] as { id: string; email: string }[]);
    return users.sort((a, b) => (a.email || "").localeCompare(b.email || ""));
  };

  const exportLogs = () => {
    const csvContent = [
      "Action,Description,User Email,IP Address,User Agent,Date",
      ...filteredLogs.map(log => 
        `"${log.action || ''}","${log.description || ''}","${log.userEmail || ''}","${log.ipAddress || ''}","${log.userAgent || ''}","${log.createdAt || ''}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Logs exported successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            Monitor and track all user activities in the system
          </p>
        </div>
        <Button onClick={exportLogs} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter activity logs by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action-filter">Action</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {getUniqueActions().map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-filter">User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {getUniqueUsers().map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Actions</span>
            </div>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredLogs.length === logs.length ? "All logs" : "Filtered results"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Unique Users</span>
            </div>
            <div className="text-2xl font-bold">
              {new Set(filteredLogs.map(log => log.userId || "")).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Active in selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Unique IPs</span>
            </div>
            <div className="text-2xl font-bold">
              {new Set(filteredLogs.filter(log => log.ipAddress).map(log => log.ipAddress || "")).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Different locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Most Active</span>
            </div>
            <div className="text-2xl font-bold">
              {(() => {
                const userCounts = filteredLogs.reduce((acc, log) => {
                  const email = log.userEmail || "Unknown";
                  acc[email] = (acc[email] || 0) + 1;
                  return acc;
                }, {} as { [key: string]: number });
                const mostActive = Object.entries(userCounts).sort(([,a], [,b]) => b - a)[0];
                return mostActive ? mostActive[1] : 0;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Actions by top user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Detailed view of all system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {getActionBadge(log.action)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium">{log.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{log.userName || log.userEmail || "Unknown"}</div>
                        <div className="text-sm text-muted-foreground">{log.userEmail || (log.userId ? `ID: ${log.userId}` : "N/A")}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.ipAddress ? (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {log.ipAddress}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(log.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log);
                        setDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No activity logs found matching the current filters.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t mt-2">
              <span className="text-sm font-medium text-muted-foreground mr-4">
                Page {safePage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(1)} disabled={safePage === 1}>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(safePage - 1)} disabled={safePage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(safePage + 1)} disabled={safePage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages}>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getActionBadge(selectedLog.action)}
            </DialogTitle>
            <DialogDescription>Activity log details</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium text-right max-w-[60%]">{selectedLog.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin</span>
                <span className="font-medium">{selectedLog.userName || selectedLog.userEmail || selectedLog.userId}</span>
              </div>
              {selectedLog.userEmail && selectedLog.userName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{selectedLog.userEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">{formatDate(selectedLog.createdAt)}</span>
              </div>
              {selectedLog.ipAddress && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IP Address</span>
                  <span className="font-medium font-mono">{selectedLog.ipAddress}</span>
                </div>
              )}
              {selectedLog.userAgent && (
                <div className="space-y-1">
                  <span className="text-muted-foreground">User Agent</span>
                  <p className="text-xs bg-muted p-2 rounded font-mono break-all">{selectedLog.userAgent}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
