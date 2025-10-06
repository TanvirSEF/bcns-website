import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${config.backendUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Authentication failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract user data from various possible response structures
    let user = data.user || data.data?.user || data;

    // Transform MongoDB _id to id for frontend compatibility
    if (user._id && !user.id) {
      user = { ...user, id: user._id };
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${config.backendUrl}/api/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Backend request failed' }));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `Update failed with status ${response.status}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Backend returns user directly (not nested)
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update profile" 
      },
      { status: 500 }
    );
  }
}
