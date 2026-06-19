"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Edit, Trash2, MapPin, Clock, Loader2, Image as ImageIcon, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "react-toastify";
import { Event } from "@/types/api";
import { api } from "@/lib/api";
import Image from "next/image";

// Reusable client-side pagination controls (mirrors the admin members page)
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

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
  );
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    category: "Program" | "Workshop" | "Meeting";
    location: string;
  }>({
    title: "",
    description: "",
    date: "",
    time: "",
    category: "Program",
    location: "",
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await api.events.getEvents();
      setEvents([...eventsData]);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        toast.error("Please select a valid image file (PNG, JPEG, or JPG)");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setEventImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = async () => {
    // Validate required fields
    if (!formData.title || !formData.date || !formData.category) {
      toast.error("Please fill in all required fields (Title, Date, Category)");
      return;
    }

    try {
      setIsSubmitting(true);
      // Convert category to lowercase for backend (backend expects: program, workshop, meeting)
      // Conditionally include eventImage to avoid exactOptionalPropertyTypes issues
      await api.events.createEvent({
        ...formData,
        category: formData.category.toLowerCase() as "program" | "workshop" | "meeting",
        ...(eventImage && { eventImage }),
      });
      
      toast.success("Event created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      setCurrentPage(1);
      fetchEvents();
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    // Validate required fields
    if (!formData.title || !formData.date || !formData.category) {
      toast.error("Please fill in all required fields (Title, Date, Category)");
      return;
    }

    try {
      setIsSubmitting(true);
      // Convert category to lowercase for backend (backend expects: program, workshop, meeting)
      // Send a new image only when one was selected; otherwise the backend keeps the existing image
      await api.events.updateEvent(editingEvent.id, {
        ...formData,
        category: formData.category.toLowerCase() as "program" | "workshop" | "meeting",
        ...(eventImage && { eventImage }),
      });

      toast.success("Event updated successfully");
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (event: Event) => {
    setDeleteTarget(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await api.events.deleteEvent(deleteTarget.id);
      toast.success(`Event "${deleteTarget.title}" deleted successfully`);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (event: Event) => {
    setEditingEvent(event); // Store for future edit functionality
    // Extract date part if ISO string, otherwise use as is
    // event.date is required in Event type, but TypeScript needs explicit handling
    const eventDate = String(event.date || "");
    const dateValue = eventDate.includes('T') ? String(eventDate.split('T')[0]) : eventDate;
    const categoryValue: "Program" | "Workshop" | "Meeting" = event.category 
      ? (event.category.charAt(0).toUpperCase() + event.category.slice(1)) as "Program" | "Workshop" | "Meeting"
      : "Program";
    
    // Ensure all optional fields have default values to satisfy TypeScript
    setFormData({
      title: event.title,
      description: event.description ?? "",
      date: dateValue,
      time: event.time ?? "",
      category: categoryValue,
      location: event.location ?? "",
    });
    setEventImage(null);
    setImagePreview(event.imageUrl || null);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      category: "Program",
      location: "",
    });
    setEventImage(null);
    setImagePreview(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    // Handle both HH:mm and HH:mm:ss formats
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  // Derive the current page slice, clamping the page so deletes never leave us out of range
  const totalPages = Math.ceil(events.length / pageSize) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedEvents = events.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage society events, conferences, and workshops
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchEvents} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Add a new event to the society calendar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: "Program" | "Workshop" | "Meeting") =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Program">Program</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="eventImage" className="text-right pt-2">
                    Event Image
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="eventImage"
                      type="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional. Accepted formats: PNG, JPEG, JPG (max 5MB)
                    </p>
                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover rounded-md border"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage and monitor all society events
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first event to get started
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {event.imageUrl ? (
                            <Image
                              src={event.imageUrl}
                              alt={event.title}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{event.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{formatDate(event.date)}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(event.time)}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                          {event.category || "program"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {event.location ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClick(event)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PaginationControls
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingEvent(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update event information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-description" className="text-right pt-2">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value: "Program" | "Workshop" | "Meeting") =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Program">Program</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-eventImage" className="text-right pt-2">
                Event Image
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="edit-eventImage"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Optional. Select a new image to replace the current one. Accepted formats: PNG, JPEG, JPG (max 5MB)
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-md border"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingEvent(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setIsDeleteDialogOpen(open);
        if (!open) {
          setDeleteTarget(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteTarget(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
