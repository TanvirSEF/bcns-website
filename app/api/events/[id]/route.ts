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
}

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/events/:id - Get single event
export async function GET(
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

    const response = await fetch(`${config.backendUrl}/api/events/${eventId}`, {
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

