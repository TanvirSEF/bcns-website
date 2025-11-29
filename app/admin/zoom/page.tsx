"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Plus, ExternalLink, Clock, Calendar, Copy, Users, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ZoomMeeting } from "@/types/api";
import { api } from "@/lib/api";

export default function ZoomMeetingsManagement() {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<ZoomMeeting | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    agenda: "",
    startTime: "",
    durationMinutes: 60,
    timezone: "Asia/Dhaka",
    password: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await api.zoom.getMeetings();
      setMeetings([...response]);
    } catch (error) {
      console.error("Failed to fetch zoom meetings:", error);
      toast.error("Failed to fetch zoom meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    // Validate required fields
    if (!formData.topic || !formData.agenda || !formData.startTime) {
      toast.error("Please fill in all required fields (Topic, Agenda, Start Time)");
      return;
    }

    // Convert datetime-local to ISO string
    const startTimeIso = new Date(formData.startTime).toISOString();

    try {
      setIsSubmitting(true);
      const meetingData: any = {
        topic: formData.topic,
        agenda: formData.agenda,
        startTimeIso,
        durationMinutes: formData.durationMinutes,
        timezone: formData.timezone,
      };
      
      // Only include password if provided
      if (formData.password && formData.password.trim()) {
        meetingData.password = formData.password;
      }
      
      const meeting = await api.zoom.createMeeting(meetingData);
      
      toast.success("Zoom meeting created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchMeetings();
      
      // Log meeting details for debugging
      console.log("Created meeting:", meeting);
    } catch (error) {
      console.error("Failed to create zoom meeting:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create zoom meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: "",
      agenda: "",
      startTime: "",
      durationMinutes: 60,
      timezone: "Asia/Dhaka",
      password: "",
    });
  };

  // TODO: Implement when update endpoint is available
  // const handleEditMeeting = async () => {
  //   if (!editingMeeting) return;
  //   
  //   try {
  //     const meeting = await api.zoom.updateMeeting(editingMeeting.id, formData);
  //     toast.success("Zoom meeting updated successfully");
  //     setIsEditDialogOpen(false);
  //     setEditingMeeting(null);
  //     resetForm();
  //     fetchMeetings();
  //   } catch (error) {
  //     toast.error("Failed to update zoom meeting");
  //   }
  // };

  // TODO: Implement when delete endpoint is available
  // const handleDeleteMeeting = async (_meetingId: string) => {
  //   if (!confirm("Are you sure you want to delete this zoom meeting?")) return;
  //   
  //   try {
  //     // API call will be implemented
  //     toast.success("Zoom meeting deleted successfully");
  //     fetchMeetings();
  //   } catch (error) {
  //     toast.error("Failed to delete zoom meeting");
  //   }
  // };

  // TODO: Implement when edit endpoint is available
  // const openEditDialog = (meeting: ZoomMeeting) => {
  //   setEditingMeeting(meeting);
  //   const meetingData = meeting as any;
  //   setFormData({
  //     topic: meeting.topic,
  //     agenda: meetingData.agenda || "",
  //     startTime: meeting.startTime ? new Date(meeting.startTime).toISOString().slice(0, 16) : "",
  //     durationMinutes: meeting.duration,
  //     timezone: meetingData.timezone || "Asia/Dhaka",
  //     password: meeting.password || "",
  //   });
  //   setIsEditDialogOpen(true);
  // };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getMeetingStatus = (startTime: string, duration: number) => {
    const now = new Date();
    const meetingStart = new Date(startTime);
    const meetingEnd = new Date(meetingStart.getTime() + duration * 60 * 1000);
    
    if (now < meetingStart) {
      return { status: "upcoming", color: "bg-blue-100 text-blue-800" };
    } else if (now >= meetingStart && now <= meetingEnd) {
      return { status: "ongoing", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "completed", color: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading zoom meetings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zoom Meetings Management</h1>
          <p className="text-muted-foreground">
            Schedule and manage virtual meetings and conferences
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Zoom Meeting</DialogTitle>
              <DialogDescription>
                Create a new virtual meeting for society members
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="topic" className="text-right">
                  Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="col-span-3"
                  placeholder="Meeting topic"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="agenda" className="text-right">
                  Agenda <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="agenda"
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="col-span-3"
                  placeholder="Meeting agenda"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="durationMinutes" className="text-right">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.durationMinutes.toString()}
                  onValueChange={(value) => setFormData({ ...formData, durationMinutes: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timezone" className="text-right">
                  Timezone
                </Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Dhaka">Asia/Dhaka (Bangladesh)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="col-span-3"
                  placeholder="Meeting password (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" onClick={handleCreateMeeting} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                    "Schedule Meeting"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Meetings</span>
            </div>
            <div className="text-2xl font-bold">{meetings.length}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Upcoming</span>
            </div>
            <div className="text-2xl font-bold">
              {meetings.filter(m => getMeetingStatus(m.startTime, m.duration).status === "upcoming").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled meetings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Duration</span>
            </div>
            <div className="text-2xl font-bold">
              {formatDuration(meetings.reduce((total, m) => total + m.duration, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined meeting time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">This Month</span>
            </div>
            <div className="text-2xl font-bold">
              {meetings.filter(m => {
                const meetingDate = new Date(m.startTime);
                const now = new Date();
                return meetingDate.getMonth() === now.getMonth() && meetingDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Meetings this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Meetings Table */}
      <Card className="border-2 shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle>All Zoom Meetings</CardTitle>
          <CardDescription>
            Manage and monitor virtual meetings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Agenda</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Timezone</TableHead>
                <TableHead>Zoom Meeting ID</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Join URL</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No meetings found. Create your first meeting to get started.
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => {
                  const status = getMeetingStatus(meeting.startTime, meeting.duration);
                  const meetingData = meeting as any;
                  return (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        <div className="font-medium">{meeting.topic || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs line-clamp-2">
                          {meetingData.agenda || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{formatDate(meeting.startTime)}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatTime(meeting.startTime)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {formatDuration(meeting.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{meetingData.timezone || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {meetingData.zoomMeetingId || "N/A"}
                        </code>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          // Direct access to password field
                          const password = String((meeting as any).password || meetingData.password || "").trim();
                          
                          if (password) {
                            return (
                              <div className="flex items-center gap-2">
                                <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                                  {password}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(password)}
                                  title="Copy password"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          }
                          return <span className="text-sm text-muted-foreground">No password</span>;
                        })()}
                      </TableCell>
                      <TableCell>
                        {meeting.joinUrl ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(meeting.joinUrl, '_blank')}
                              title="Join meeting"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Join
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(meeting.joinUrl)}
                              title="Copy join URL"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {meeting.createdBy || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          {status.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Zoom Meeting</DialogTitle>
            <DialogDescription>
              {editingMeeting ? `Update meeting: ${editingMeeting.topic}` : "Update meeting information"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center text-muted-foreground">
            Edit functionality will be available soon.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setEditingMeeting(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
