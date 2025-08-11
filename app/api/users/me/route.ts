import { NextRequest, NextResponse } from "next/server";

function buildAuthHeader(request: NextRequest): string | undefined {
  let authHeader = request.headers.get("authorization") || undefined;
  if (!authHeader) {
    const cookieToken = request.cookies.get("auth_token")?.value;
    if (cookieToken) authHeader = `Bearer ${cookieToken}`;
  }
  return authHeader;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = buildAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const response = await fetch("https://api.tanvirmern.com/api/users/me", {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
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

    const response = await fetch("https://api.tanvirmern.com/api/users/me", {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
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
      "Access-Control-Allow-Methods": "GET, PATCH",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
