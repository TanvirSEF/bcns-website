import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";

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
      console.error('[PATCH /api/users/me] No token found');
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const backendUrl = `${config.backendUrl}/api/users/me`;
    const requestBody = JSON.stringify(body);

    // Use fetchWithTimeout to handle backend timeouts properly
    // Increased timeout for backend operations that may take longer
    let response: Response;
    try {
      response = await fetchWithTimeout(backendUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestBody,
        timeout: 60000, // 60 seconds for backend operations
      });
    } catch (timeoutError) {
      // If timeout occurs, check if it's a real timeout or just slow response
      if (timeoutError instanceof Error && timeoutError.message.includes('timeout')) {
        console.error('[PATCH /api/users/me] Backend request timeout:', timeoutError);
        return NextResponse.json(
          { 
            success: false, 
            message: "Backend server is taking too long to respond. Please try again." 
          },
          { status: 504 }
        );
      }
      throw timeoutError;
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Backend request failed with status ${response.status}` };
      }
      console.error('[PATCH /api/users/me] Backend error:', errorData);
      // Only return user-friendly message, don't expose backend error details
      const userMessage = errorData.message || "Failed to update profile. Please try again.";
      return NextResponse.json(
        { 
          success: false, 
          message: userMessage
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[PATCH /api/users/me] Failed to parse backend response:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid response from backend server" 
        },
        { status: 502 }
      );
    }

    // Backend returns user directly (not nested) or might be nested in data/user
    // Handle different possible response structures
    let userData;
    if (data.user) {
      userData = data.user;
    } else if (data.data) {
      userData = data.data;
    } else {
      // If no nested structure, assume data is the user object directly
      userData = data;
    }

    // Transform MongoDB _id to id for frontend compatibility
    if (userData && userData._id && !userData.id) {
      userData = { ...userData, id: userData._id };
    }
    
    const finalResponse = {
      success: true,
      data: userData,
    };
    
    return NextResponse.json(finalResponse);
  } catch (error) {
    // Log full error details on server side for debugging
    console.error("[PATCH /api/users/me] Unexpected error:", error);
    // Only return user-friendly message, don't expose stack traces or internal error details
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to update profile. Please try again."
      },
      { status: 500 }
    );
  }
}
