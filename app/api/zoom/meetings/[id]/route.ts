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

// GET /api/zoom/meetings/[id] - Get single Zoom meeting
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Meeting ID is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${config.backendUrl}/api/zoom/meetings/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to fetch zoom meeting" }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch zoom meeting",
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
    });
  } catch (error) {
    console.error("Get zoom meeting API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch zoom meeting",
      },
      { status: 500 }
    );
  }
}

