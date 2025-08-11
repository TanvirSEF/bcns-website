import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let authHeader = request.headers.get("authorization");
    // Fallback to token stored as httpOnly cookie during login proxy
    if (!authHeader) {
      const cookieToken = request.cookies.get("auth_token")?.value;
      if (cookieToken) {
        authHeader = `Bearer ${cookieToken}`;
      }
    }

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    // Forward upstream session cookie if present (for cookie-based auth)
    const upstreamCookieEncoded =
      request.cookies.get("upstream_session")?.value;
    const upstreamCookie = upstreamCookieEncoded
      ? Buffer.from(upstreamCookieEncoded, "base64").toString("utf8")
      : undefined;

    const response = await fetch(
      "https://api.tanvirmern.com/api/auth/profile",
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          ...(upstreamCookie ? { cookie: upstreamCookie } : {}),
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Proxy profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
