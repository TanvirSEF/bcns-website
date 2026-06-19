"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BarChart3, Users, Calendar, FileText, Eye, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  lastUpdated: string;
}

export default function SearchAndAnalytics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchType, setSearchType] = useState<string>("all");
  const [stats, setStats] = useState({ users: 0, events: 0, publications: 0, polls: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, events, publications, polls] = await Promise.all([
        api.admin.getAllUsers({ limit: 1 }).catch(() => []),
        api.events.getEvents(undefined, 1).catch(() => []),
        api.publications.getPublications().catch(() => []),
        api.polls.getPolls().catch(() => []),
      ]);
      setStats({
        users: (users as readonly any[]).length,
        events: (events as readonly any[]).length,
        publications: (publications as readonly any[]).length,
        polls: (polls as readonly any[]).length,
      });
    } catch {
      /* best-effort */
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearching(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      let results: SearchResult[] = data.data || [];
      if (searchType !== "all") {
        results = results.filter((r) => r.type === searchType);
      }
      setSearchResults(results);
    } catch (error) {
      toast.error("Search failed");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors: { [key: string]: string } = {
      user: "bg-blue-100 text-blue-800",
      event: "bg-emerald-100 text-emerald-800",
      publication: "bg-amber-100 text-amber-800",
    };
    return (
      <Badge className={typeColors[type] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getDetailLink = (result: SearchResult) => {
    switch (result.type) {
      case "user": return `/admin/members/${result.id}`;
      case "event": return `/events`;
      case "publication": return `/admin/publications`;
      default: return "#";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-card rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Search & Analytics</h1>
        <p className="text-muted-foreground">Search across all content and view system overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Members", value: stats.users, icon: Users, color: "text-blue-600" },
          { label: "Events", value: stats.events, icon: Calendar, color: "text-emerald-600" },
          { label: "Publications", value: stats.publications, icon: FileText, color: "text-amber-600" },
          { label: "Polls", value: stats.polls, icon: BarChart3, color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5" />
            Global Search
          </CardTitle>
          <CardDescription>Search across members, events, and publications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, title, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">Members</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="publication">Publications</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
              </p>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((result) => (
                      <TableRow key={`${result.type}-${result.id}`}>
                        <TableCell>{getTypeBadge(result.type)}</TableCell>
                        <TableCell className="font-medium">{result.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{result.description}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(result.lastUpdated)}</TableCell>
                        <TableCell>
                          <Button asChild variant="outline" size="sm">
                            <Link href={getDetailLink(result)}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            !searching && searchQuery && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm">No results found. Try a different search term.</p>
              </div>
            )
          )}

          {!searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm">Start typing to search across all content.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/admin/members">
                <Users className="h-6 w-6" />
                <span>Manage Members</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/admin/events">
                <Calendar className="h-6 w-6" />
                <span>Manage Events</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col gap-2">
              <Link href="/admin/publications">
                <FileText className="h-6 w-6" />
                <span>Manage Publications</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
