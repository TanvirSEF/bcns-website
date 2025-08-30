import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return request.cookies.get("auth_token")?.value || null;
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

    // Call backend delete endpoint (matches your backend exactly)
    const response = await fetch(`${config.backendUrl}/api/users/me/profile-picture/delete`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Profile picture deletion failed" }));
      throw new Error(errorData.message || "Profile picture deletion failed");
    }
    
    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Profile picture deleted successfully",
      data: data,
    });
  } catch (error) {
    console.error("Profile picture delete API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Profile picture deletion failed",
      },
      { status: 500 }
    );
  }
}
