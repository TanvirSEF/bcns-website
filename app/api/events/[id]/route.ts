import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

interface BackendEvent {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  category?: string;
  location?: string;
  imageUrl?: string;
  eventImage?: string; // Backend returns eventImage field
  image_url?: string; // Alternative field name
  createdAt?: string;
  updatedAt?: string;
  isRegistered?: boolean;
  slug?: string;
  attendees?: string;
  decisions?: string;
  registrationUrl?: string;
}

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/events/:id - Get single event (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);

    const { id: eventId } = await params;

    const response = await fetch(`${config.backendUrl}/api/events/${eventId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch event",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    const event: BackendEvent = (data.event || data.data || data) as BackendEvent;

    const formattedEvent = {
      id: event._id || event.id,
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time || "",
      category: event.category || "program",
      location: event.location || "",
      // Check multiple possible field names for image URL
      imageUrl: event.eventImage || event.imageUrl || event.image_url || undefined,
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: event.updatedAt || new Date().toISOString(),
      isRegistered: event.isRegistered || false,
      slug: event.slug || undefined,
      attendees: event.attendees || undefined,
      decisions: event.decisions || undefined,
      registrationUrl: event.registrationUrl || undefined,
    };

    return NextResponse.json({
      success: true,
      data: formattedEvent,
    });
  } catch (error) {
    console.error("Get event API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PATCH /api/events/:id - Update event (Admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    let category = formData.get("category") as string;
    const location = formData.get("location") as string;
    const eventImage = formData.get("eventImage") as File | null;

    // Ensure category is lowercase if present (backend expects lowercase)
    if (category) {
      category = category.toLowerCase();
    }

    // Forward only present fields to the backend (partial update)
    const backendFormData = new FormData();
    if (title) backendFormData.append("title", title);
    if (description) backendFormData.append("description", description);
    if (date) backendFormData.append("date", date);
    if (time) backendFormData.append("time", time);
    if (category) backendFormData.append("category", category);
    if (location) backendFormData.append("location", location);
    if (eventImage) {
      backendFormData.append("eventImage", eventImage);
    }

    const response = await fetch(`${config.backendUrl}/api/events/${eventId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to update event",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    const event: BackendEvent = (data.event || data.data || data) as BackendEvent;

    const formattedEvent = {
      id: event._id || event.id,
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time || "",
      category: event.category || category,
      location: event.location || "",
      // Check multiple possible field names for image URL
      imageUrl: event.eventImage || event.imageUrl || event.image_url || undefined,
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: event.updatedAt || new Date().toISOString(),
      isRegistered: event.isRegistered || false,
    };

    return NextResponse.json({
      success: true,
      data: formattedEvent,
    });
  } catch (error) {
    console.error("Update event API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/:id - Delete event (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;
    if (!eventId) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${config.backendUrl}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to delete event",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete event" },
      { status: 500 }
    );
  }
}

