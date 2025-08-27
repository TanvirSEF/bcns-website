import { NextRequest, NextResponse } from "next/server";
import { fetchFromBackend, getAuthHeader } from "@/lib/server-utils";

function buildAuthHeader(request: NextRequest): string | undefined {
  let authHeader = getAuthHeader(request);
  if (!authHeader) {
    const cookieToken = request.cookies.get("auth_token")?.value;
    if (cookieToken) authHeader = `Bearer ${cookieToken}`;
  }
  return authHeader;
}

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = buildAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const data = await fetchFromBackend("/api/users/me/change-password", {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch {
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
      "Access-Control-Allow-Methods": "PATCH",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
