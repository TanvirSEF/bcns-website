import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/polls - Get all polls (Public)
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    const response = await fetch(`${config.backendUrl}/api/polls`, {
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
          message: errorData.message || "Failed to fetch polls",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let polls = [];
    if (Array.isArray(data)) {
      polls = data;
    } else if (data.polls) {
      polls = data.polls;
    } else if (data.data) {
      polls = Array.isArray(data.data) ? data.data : [];
    }

    // Map to frontend format
    const formattedPolls = polls.map((poll: any) => {
      // Extract ID from MongoDB format
      const id = poll._id?.$oid || poll._id || poll.id || "";
      
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

      return {
        id,
        question: poll.title || poll.question || "",
        description: poll.description || "",
        options,
        isActive,
        createdBy: poll.createdBy?.$oid || poll.createdBy || "",
        createdAt,
        startDate,
        endDate,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPolls,
    });
  } catch (error) {
    console.error("Polls API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

// POST /api/polls - Create poll (Admin only)
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
    if (!body.title || !body.description || !body.options || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, message: "Title, description, options, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    // Validate options
    if (!Array.isArray(body.options) || body.options.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one option is required" },
        { status: 400 }
      );
    }

    // Validate option structure
    for (const option of body.options) {
      if (!option.name || typeof option.name !== 'string' || option.name.trim() === '') {
        return NextResponse.json(
          { success: false, message: "All options must have a valid name" },
          { status: 400 }
        );
      }
    }

    // Forward to backend API
    const response = await fetch(`${config.backendUrl}/api/polls`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: body.title,
        description: body.description,
        options: body.options,
        startDate: body.startDate,
        endDate: body.endDate,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create poll" }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to create poll",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || "Poll created successfully",
    });
  } catch (error) {
    console.error("Create poll API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create poll",
      },
      { status: 500 }
    );
  }
}

