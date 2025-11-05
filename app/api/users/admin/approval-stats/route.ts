import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";
import { fetchWithTimeout, getErrorMessage, getErrorStatusCode } from "@/lib/fetch-with-timeout";

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

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/users/admin/approval-stats`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || "Failed to fetch approval statistics" 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let stats = data;
    if (data.data) {
      stats = data.data;
    } else if (data.stats) {
      stats = data.stats;
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Approval stats API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage || "Failed to fetch approval statistics" 
      },
      { status: statusCode }
    );
  }
}

