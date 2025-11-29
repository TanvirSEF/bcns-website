import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/polls/:id - Get single poll (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Poll ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/polls/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch poll",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    const poll = data.poll || data.data || data;

    // Extract ID from MongoDB format
    const pollId = poll._id?.$oid || poll._id || poll.id || "";
    
    // Extract dates from MongoDB format
    const createdAt = poll.createdAt?.$date 
      ? new Date(poll.createdAt.$date).toISOString()
      : poll.createdAt 
      ? new Date(poll.createdAt).toISOString()
      : new Date().toISOString();
    
    const startDate = poll.startDate?.$date 
      ? new Date(poll.startDate.$date).toISOString()
      : poll.startDate 
      ? new Date(poll.startDate).toISOString()
      : undefined;
    
    const endDate = poll.endDate?.$date 
      ? new Date(poll.endDate.$date).toISOString()
      : poll.endDate 
      ? new Date(poll.endDate).toISOString()
      : undefined;

    // Map options
    const options = (poll.options || []).map((opt: any) => ({
      id: opt._id?.$oid || opt._id || opt.id || "",
      text: opt.name || opt.text || "",
      votes: opt.votes || 0,
    }));

    // Map status to isActive with smart date-based logic
    // Even if status is "upcoming", check if dates indicate it should be active
    let isActive = false;
    const now = new Date();
    
    // First, check dates to determine actual status
    let dateBasedActive = false;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      dateBasedActive = now >= start && now <= end;
    } else if (startDate) {
      const start = new Date(startDate);
      dateBasedActive = now >= start;
    } else if (endDate) {
      const end = new Date(endDate);
      dateBasedActive = now <= end;
    }
    
    // Use date-based logic if status is "upcoming" or "ended" but dates say otherwise
    if (poll.status === "upcoming" && dateBasedActive) {
      // If status is "upcoming" but current time >= startDate, make it active
      isActive = true;
    } else if (poll.status === "active") {
      // If status is "active", use it (but respect endDate)
      isActive = dateBasedActive !== false ? dateBasedActive : true;
    } else if (poll.status === "ended" || (poll.status && !dateBasedActive)) {
      // If status is "ended" or dates indicate ended, make it inactive
      isActive = false;
    } else if (poll.isActive !== undefined) {
      // If isActive field exists, use it
      isActive = poll.isActive;
    } else {
      // Default: use date-based calculation
      isActive = dateBasedActive;
    }

    // Map to frontend format
    const formattedPoll = {
      id: pollId,
      question: poll.title || poll.question || "",
      description: poll.description || "",
      options,
      isActive,
      createdBy: poll.createdBy?.$oid || poll.createdBy || "",
      createdAt,
      startDate,
      endDate,
    };

    return NextResponse.json({
      success: true,
      data: formattedPoll,
    });
  } catch (error) {
    console.error("Poll API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch poll" },
      { status: 500 }
    );
  }
}

