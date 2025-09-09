import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getRefreshToken(request: NextRequest): string | null {
  // Try to get refresh token from request body first, then cookies
  const refreshTokenCookie = request.cookies.get("refresh_token")?.value;
  return refreshTokenCookie || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken = body.refreshToken || getRefreshToken(request);

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: "No refresh token provided",
          code: "NO_REFRESH_TOKEN"
        },
        { status: 401 }
      );
    }

    // Call backend to refresh token
    const response = await fetch(`${config.backendUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || "Token refresh failed",
          code: data.code || "REFRESH_FAILED"
        },
        { status: response.status }
      );
    }

    // Return the new token data
    const responseData = {
      success: true,
      data: {
        token: data.token || data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 3600, // Default to 1 hour
        user: data.user,
      },
    };

    const nextResponse = NextResponse.json(responseData);

    // Set cookies for the new tokens
    if (responseData.data.token) {
      nextResponse.cookies.set("auth_token", responseData.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: responseData.data.expiresIn,
      });
    }

    if (responseData.data.refreshToken) {
      nextResponse.cookies.set("refresh_token", responseData.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Token refresh API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error during token refresh",
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    );
  }
}
