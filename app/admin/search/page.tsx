"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BarChart3, TrendingUp, Users, FileText, Calendar, Eye, Download, Filter, Globe, Activity } from "lucide-react";
import { toast } from "react-toastify";

interface SearchResult {
  id: string;
  type: "user" | "event" | "document" | "publication" | "poll";
  title: string;
  description: string;
  relevance: number;
  lastUpdated: string;
}

interface AnalyticsData {
  totalUsers: number;
  totalEvents: number;
  totalDocuments: number;
  totalPublications: number;
  activePolls: number;
  monthlyGrowth: number;
  topSearches: string[];
  userActivity: { date: string; count: number }[];
}

export default function SearchAndAnalytics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getAnalytics();
      // setAnalyticsData(response);
      
      // Mock data for now
      setAnalyticsData({
        totalUsers: 156,
        totalEvents: 24,
        totalDocuments: 89,
        totalPublications: 45,
        activePolls: 3,
        monthlyGrowth: 12.5,
        topSearches: [
          "pediatric neurology",
          "epilepsy treatment",
          "research methodology",
          "conference registration",
          "member benefits"
        ],
        userActivity: [
          { date: "2024-01-20", count: 45 },
          { date: "2024-01-21", count: 52 },
          { date: "2024-01-22", count: 48 },
          { date: "2024-01-23", count: 61 },
          { date: "2024-01-24", count: 55 },
          { date: "2024-01-25", count: 58 },
        ]
      });
    } catch (error) {
      toast.error("Failed to fetch analytics data");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await search(searchQuery, { type: searchType, dateRange });
      // setSearchResults(response);
      
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "user",
          title: "Dr. Ahmed Rahman",
          description: "Pediatric Neurologist, BSMMU",
          relevance: 95,
          lastUpdated: "2024-01-25",
        },
        {
          id: "2",
          type: "event",
          title: "Annual Neurology Conference 2024",
          description: "Join us for the biggest neurology event of the year",
          relevance: 88,
          lastUpdated: "2024-01-20",
        },
        {
          id: "3",
          type: "document",
          title: "Research Proposal - Pediatric Neurology",
          description: "Research proposal for pediatric neurology study",
          relevance: 82,
          lastUpdated: "2024-01-15",
        },
        {
          id: "4",
          type: "publication",
          title: "Advances in Pediatric Neurology: A Comprehensive Review",
          description: "This comprehensive review covers the latest developments...",
          relevance: 78,
          lastUpdated: "2024-01-10",
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const typeColors: { [key: string]: string } = {
      user: "bg-blue-100 text-blue-800",
      event: "bg-green-100 text-green-800",
      document: "bg-purple-100 text-purple-800",
      publication: "bg-orange-100 text-orange-800",
      poll: "bg-teal-100 text-teal-800",
    };

    return (
      <Badge className={typeColors[type] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return "text-green-600";
    if (relevance >= 80) return "text-yellow-600";
    if (relevance >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const exportSearchResults = () => {
    if (searchResults.length === 0) {
      toast.info("No search results to export");
      return;
    }

    const csvContent = [
      "Type,Title,Description,Relevance,Last Updated",
      ...searchResults.map(result => 
        `"${result.type}","${result.title}","${result.description}","${result.relevance}%","${result.lastUpdated}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `search-results-${searchQuery}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Search results exported successfully");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search & Analytics</h1>
          <p className="text-muted-foreground">
            Search across all content and view system analytics
          </p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>Global Search</CardTitle>
          <CardDescription>
            Search across users, events, documents, publications, and polls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <div>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="publication">Publications</SelectItem>
                  <SelectItem value="poll">Polls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Found {searchResults.length} results for &quot;{searchQuery}&quot;
                </div>
                <Button variant="outline" size="sm" onClick={exportSearchResults}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Relevance</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        {getTypeBadge(result.type)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{result.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${getRelevanceColor(result.relevance)}`}>
                          {result.relevance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {formatDate(result.lastUpdated)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement view functionality
                            toast.info("View functionality coming soon");
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      {analyticsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Users</span>
                </div>
                <div className="text-2xl font-bold">{analyticsData.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Events</span>
                </div>
                                    <div className="text-2xl font-bold">{analyticsData.totalEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Scheduled events
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Documents</span>
                </div>
                <div className="text-2xl font-bold">{analyticsData.totalDocuments}</div>
                <p className="text-xs text-muted-foreground">
                  Uploaded files
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Growth</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  +{analyticsData.monthlyGrowth}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly growth
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Top Searches */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>Top Search Terms</CardTitle>
              <CardDescription>
                Most popular search queries by users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.topSearches.map((search, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{search}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 10} searches
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Activity Chart */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle>User Activity Trend</CardTitle>
              <CardDescription>
                Daily user activity over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {analyticsData.userActivity.map((day, index) => {
                  const maxCount = Math.max(...analyticsData.userActivity.map(d => d.count));
                  const height = (day.count / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                        style={{ height: `${height}%` }}
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        <div>{day.count}</div>
                        <div>{formatDate(day.date)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Quick Actions */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Members</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Create Event</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Upload Document</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
