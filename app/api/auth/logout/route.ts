import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);

    if (token) {
      // Try to logout from backend
      try {
        await fetch(`${config.backendUrl}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        // Ignore backend logout errors
        console.log("Backend logout failed:", error);
      }
    }

    // Always return success to clear frontend state
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear any cookies
    response.cookies.delete("auth_token");
    response.cookies.delete("upstream_session");

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
