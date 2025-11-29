import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// Helper function to get user name from user object or ID
function getUserName(user: any): string {
  if (!user) return "";
  if (typeof user === "string") return user;
  if (user.name) return user.name;
  if (user.email) return user.email;
  if (user._id?.$oid) return user._id.$oid;
  if (user._id) return user._id;
  if (user.id) return user.id;
  return "";
}

// Helper function to format meeting data
function formatMeeting(meeting: any) {
  const meetingId = meeting._id?.$oid || meeting._id || meeting.id || "";
  const createdAt = meeting.createdAt?.$date 
    ? new Date(meeting.createdAt.$date).toISOString()
    : meeting.createdAt 
    ? new Date(meeting.createdAt).toISOString()
    : new Date().toISOString();

  // Handle createdBy - could be ID or populated user object
  const createdByUser = meeting.createdByUserId || meeting.createdBy;
  const createdByName = getUserName(createdByUser);

  // Extract password from meeting object
  const password = meeting.password 
    ? String(meeting.password) 
    : meeting.zoomPayload?.password 
    ? String(meeting.zoomPayload.password) 
    : "";

  return {
    id: meetingId,
    topic: meeting.topic || "",
    agenda: meeting.agenda || "",
    startTime: meeting.startTimeIso || meeting.startTime || "",
    duration: meeting.durationMinutes || meeting.duration || 60,
    joinUrl: meeting.joinUrl || meeting.join_url || "",
    startUrl: meeting.startUrl || meeting.zoomPayload?.start_url || "",
    zoomMeetingId: meeting.zoomMeetingId || meeting.zoomPayload?.id?.toString() || "",
    password: password,
    timezone: meeting.timezone || "Asia/Dhaka",
    createdBy: createdByName,
    createdAt,
  };
}

// GET /api/zoom/meetings - List all Zoom meetings
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${config.backendUrl}/api/zoom/meetings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Debug: Log backend response status
    console.log("Backend API response status:", response.status);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch zoom meetings" }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch zoom meetings",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Handle different response structures from backend
    const meetings = data.meetings || data.data || data || [];
    
    // Map all meetings to frontend format
    const formattedMeetings = Array.isArray(meetings)
      ? meetings.map(formatMeeting)
      : [formatMeeting(meetings)];

    return NextResponse.json({
      success: true,
      data: formattedMeetings,
    });
  } catch (error) {
    console.error("Get zoom meetings API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch zoom meetings",
      },
      { status: 500 }
    );
  }
}

// POST /api/zoom/meetings - Create Zoom meeting (Admin only)
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.topic || !body.agenda || !body.startTimeIso || !body.durationMinutes) {
      return NextResponse.json(
        { success: false, message: "Topic, agenda, startTimeIso, and durationMinutes are required" },
        { status: 400 }
      );
    }

    // Validate duration (must be positive)
    if (body.durationMinutes <= 0) {
      return NextResponse.json(
        { success: false, message: "Duration must be greater than 0" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${config.backendUrl}/api/zoom/meetings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: body.topic,
        agenda: body.agenda,
        startTimeIso: body.startTimeIso,
        durationMinutes: body.durationMinutes,
        timezone: body.timezone || "Asia/Dhaka",
        password: body.password || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create zoom meeting" }));
      
      // Handle Zoom API specific errors
      let errorMessage = errorData.message || "Failed to create zoom meeting";
      
      // Check for Zoom scope/permission errors
      if (errorMessage.includes("scopes") || errorMessage.includes("access token")) {
        errorMessage = "Zoom API access token is missing required permissions. Please contact administrator to configure Zoom API scopes.";
      } else if (errorMessage.includes("Invalid access token")) {
        errorMessage = "Zoom API authentication failed. Please check Zoom API credentials.";
      }
      
      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          code: errorData.code,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    const meeting = data.meeting || data.data || data;

    // Map to frontend format
    const formattedMeeting = formatMeeting(meeting);

    return NextResponse.json({
      success: true,
      data: formattedMeeting,
      message: data.message || "Zoom meeting created successfully",
    });
  } catch (error) {
    console.error("Create zoom meeting API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create zoom meeting",
      },
      { status: 500 }
    );
  }
}

