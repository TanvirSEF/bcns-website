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

    const { id: userId } = await params;

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/users/admin/${userId}/approve`,
      {
        method: "PATCH",
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
          message: errorData.message || "Failed to approve user" 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let result = data;
    if (data.data) {
      result = data.data;
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: data.message || "User approved successfully",
    });
  } catch (error) {
    console.error("Approve user API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage || "Failed to approve user" 
      },
      { status: statusCode }
    );
  }
}

