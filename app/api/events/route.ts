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
  eventImage?: string;
  eventImages?: string[];
  image_url?: string;
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

// GET /api/events - Get all events (public; optional category/page/limit)
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    // Forward category / page / limit to the backend (findAll is public)
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    for (const key of ["category", "page", "limit"]) {
      const value = searchParams.get(key);
      if (value) params.set(key, value);
    }
    const qs = params.toString();
    const backendUrl = `${config.backendUrl}/api/events${qs ? `?${qs}` : ""}`;

    const response = await fetch(backendUrl, {
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
          message: errorData.message || "Failed to fetch events",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let events = [];
    if (Array.isArray(data)) {
      events = data;
    } else if (data.events) {
      events = data.events;
    } else if (data.data) {
      events = Array.isArray(data.data) ? data.data : [];
    }

    // Map to frontend format
    const formattedEvents = events.map((event: BackendEvent) => {
      const primaryImage = event.eventImage || event.imageUrl || event.image_url || undefined;
      const imagesArray = Array.isArray(event.eventImages) && event.eventImages.length > 0
        ? event.eventImages
        : (primaryImage ? [primaryImage] : []);

      return {
        id: event._id || event.id,
        title: event.title,
        description: event.description || "",
        date: event.date,
        time: event.time || "",
        category: event.category || "program",
        location: event.location || "",
        imageUrl: primaryImage,
        eventImages: imagesArray,
        createdAt: event.createdAt || new Date().toISOString(),
        updatedAt: event.updatedAt || new Date().toISOString(),
        isRegistered: event.isRegistered || false,
        slug: event.slug || undefined,
        attendees: event.attendees || undefined,
        decisions: event.decisions || undefined,
        registrationUrl: event.registrationUrl || undefined,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedEvents,
    });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create event (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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
    const eventImagesFiles = formData.getAll("eventImages");

    // Ensure category is lowercase (backend expects: program, workshop, meeting)
    if (category) {
      category = category.toLowerCase();
    }

    // Validate required fields
    if (!title || !date || !category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, date, and category are required",
        },
        { status: 400 }
      );
    }

    // Prepare form data for backend
    const backendFormData = new FormData();
    backendFormData.append("title", title);
    if (description) backendFormData.append("description", description);
    backendFormData.append("date", date);
    if (time) backendFormData.append("time", time);
    backendFormData.append("category", category);
    if (location) backendFormData.append("location", location);
    if (eventImage) {
      backendFormData.append("eventImage", eventImage);
    }
    eventImagesFiles.forEach((file) => {
      if (file instanceof File) {
        backendFormData.append("eventImages", file);
      }
    });

    const response = await fetch(`${config.backendUrl}/api/events`, {
      method: "POST",
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
          message: errorData.message || "Failed to create event",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    const event = data.event || data.data || data;

    const primaryImage = event.eventImage || event.imageUrl || event.image_url || undefined;
    const formattedEvent = {
      id: event._id || event.id,
      title: event.title,
      description: event.description || "",
      date: event.date,
      time: event.time || "",
      category: event.category || category,
      location: event.location || "",
      imageUrl: primaryImage,
      eventImages: Array.isArray(event.eventImages) && event.eventImages.length > 0
        ? event.eventImages
        : (primaryImage ? [primaryImage] : []),
      createdAt: event.createdAt || new Date().toISOString(),
      updatedAt: event.updatedAt || new Date().toISOString(),
      isRegistered: event.isRegistered || false,
    };

    return NextResponse.json({
      success: true,
      data: formattedEvent,
    });
  } catch (error) {
    console.error("Create event API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create event" },
      { status: 500 }
    );
  }
}

