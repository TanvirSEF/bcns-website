import { NextRequest, NextResponse } from "next/server";
import {
  fetchFromBackend,
  fetchMultipartFromBackend,
  getAuthHeader,
} from "@/lib/server-utils";

function buildAuthHeader(request: NextRequest): string | undefined {
  let authHeader = getAuthHeader(request);
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

    const data = await fetchFromBackend<Record<string, unknown>>(
      "/api/users/me",
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
        },
      }
    );
    const normalized =
      data && typeof data === "object"
        ? (data as { user?: unknown; data?: { user?: unknown } }).user ||
          (data as { user?: unknown; data?: { user?: unknown } }).data?.user ||
          data
        : data;
    return NextResponse.json(normalized, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PATCH",
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

// Proxy to backend upload endpoint for profile images (uses user's auth header)
export async function POST(request: NextRequest) {
  try {
    const authHeader = buildAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    // Forward to your backend's profile picture upload endpoint
    const upstreamForm = new FormData();
    upstreamForm.append("profilePicture", file); // Match your backend's expected field name
    const data = await fetchMultipartFromBackend(
      "/api/users/me/profile-picture",
      upstreamForm,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PATCH, POST",
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

    const data = await fetchFromBackend<Record<string, unknown>>(
      "/api/users/me",
      {
        method: "PATCH",
        headers: {
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );
    // Normalize response to always return the user object at top-level
    const normalized =
      data && typeof data === "object"
        ? (data as { user?: unknown; data?: { user?: unknown } }).user ||
          (data as { user?: unknown; data?: { user?: unknown } }).data?.user ||
          data
        : data;
    return NextResponse.json(normalized, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PATCH",
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
      "Access-Control-Allow-Methods": "GET, PATCH, POST",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
