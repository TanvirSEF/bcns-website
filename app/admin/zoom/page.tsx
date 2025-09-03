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
import { Video, Plus, Edit, Trash2, ExternalLink, Clock, User, Calendar, Copy, Users } from "lucide-react";
import { toast } from "react-toastify";
import { ZoomMeeting } from "@/types/api";

export default function ZoomMeetingsManagement() {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<ZoomMeeting | null>(null);
  const [formData, setFormData] = useState({
    topic: "",
    startTime: "",
    duration: 60,
    joinUrl: "",
    password: "",
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await getZoomMeetings();
      // setMeetings(response);
      
      // Mock data for now
      setMeetings([
        {
          id: "1",
          topic: "Monthly Neurology Case Discussion",
          startTime: "2024-02-01T14:00:00Z",
          duration: 90,
          joinUrl: "https://zoom.us/j/123456789",
          password: "neurology2024",
          createdBy: "admin@bcns.org.bd",
          createdAt: "2024-01-20",
        },
        {
          id: "2",
          topic: "Research Paper Review Session",
          startTime: "2024-02-05T16:00:00Z",
          duration: 120,
          joinUrl: "https://zoom.us/j/987654321",
          password: "research2024",
          createdBy: "admin@bcns.org.bd",
          createdAt: "2024-01-22",
        },
        {
          id: "3",
          topic: "Pediatric Neurology Workshop",
          startTime: "2024-02-10T10:00:00Z",
          duration: 180,
          joinUrl: "https://zoom.us/j/456789123",
          password: "pediatric2024",
          createdBy: "admin@bcns.org.bd",
          createdAt: "2024-01-25",
        },
      ]);
    } catch (error) {
      toast.error("Failed to fetch zoom meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      // TODO: Replace with actual API call
      // await createZoomMeeting(formData);
      
      toast.success("Zoom meeting created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        topic: "",
        startTime: "",
        duration: 60,
        joinUrl: "",
        password: "",
      });
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to create zoom meeting");
    }
  };

  const handleEditMeeting = async () => {
    if (!editingMeeting) return;
    
    try {
      // TODO: Replace with actual API call
      // await updateZoomMeeting(editingMeeting.id, formData);
      
      toast.success("Zoom meeting updated successfully");
      setIsEditDialogOpen(false);
      setEditingMeeting(null);
      setFormData({
        topic: "",
        startTime: "",
        duration: 60,
        joinUrl: "",
        password: "",
      });
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to update zoom meeting");
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this zoom meeting?")) return;
    
    try {
      // TODO: Replace with actual API call
      // await deleteZoomMeeting(meetingId);
      
      toast.success("Zoom meeting deleted successfully");
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to delete zoom meeting");
    }
  };

  const openEditDialog = (meeting: ZoomMeeting) => {
    setEditingMeeting(meeting);
    setFormData({
      topic: meeting.topic,
      startTime: meeting.startTime,
      duration: meeting.duration,
      joinUrl: meeting.joinUrl,
      password: meeting.password || "",
    });
    setIsEditDialogOpen(true);
  };

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
                  Topic
                </Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="col-span-3"
                  placeholder="Meeting topic"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration
                </Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
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
                <Label htmlFor="joinUrl" className="text-right">
                  Join URL
                </Label>
                <Input
                  id="joinUrl"
                  value={formData.joinUrl}
                  onChange={(e) => setFormData({ ...formData, joinUrl: e.target.value })}
                  className="col-span-3"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="col-span-3"
                  placeholder="Meeting password (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateMeeting}>
                Schedule Meeting
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
                <TableHead>Meeting</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => {
                const status = getMeetingStatus(meeting.startTime, meeting.duration);
                return (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{meeting.topic}</div>
                        <div className="text-sm text-muted-foreground">
                          Created by {meeting.createdBy}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
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
                        <Clock className="h-4 w-4" />
                        {formatDuration(meeting.duration)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        {status.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(meeting.joinUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(meeting.joinUrl)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        {meeting.password && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Password:</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {meeting.password}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(meeting.password || "")}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(meeting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
              Update meeting information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-topic" className="text-right">
                Topic
              </Label>
              <Input
                id="edit-topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="edit-startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-duration" className="text-right">
                Duration
              </Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
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
              <Label htmlFor="edit-joinUrl" className="text-right">
                Join URL
              </Label>
              <Input
                id="edit-joinUrl"
                value={formData.joinUrl}
                onChange={(e) => setFormData({ ...formData, joinUrl: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-password" className="text-right">
                Password
              </Label>
              <Input
                id="edit-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditMeeting}>
              Update Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
