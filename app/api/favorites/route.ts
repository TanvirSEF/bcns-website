import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/favorites - List the current user's favorites
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${config.backendUrl}/api/favorites`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to fetch favorites" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const favorites = Array.isArray(data) ? data : data.data || data.favorites || [];

    return NextResponse.json({ success: true, data: favorites });
  } catch (error) {
    console.error("Favorites API error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch favorites" }, { status: 500 });
  }
}

// POST /api/favorites - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetId } = body;

    if (!targetType || !targetId) {
      return NextResponse.json(
        { success: false, message: "targetType and targetId are required" },
        { status: 400 },
      );
    }

    const response = await fetch(`${config.backendUrl}/api/favorites`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to add favorite" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data: data.data || data });
  } catch (error) {
    console.error("Add favorite API error:", error);
    return NextResponse.json({ success: false, message: "Failed to add favorite" }, { status: 500 });
  }
}

// DELETE /api/favorites?targetType=...&targetId=... - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get("targetType");
    const targetId = searchParams.get("targetId");

    if (!targetType || !targetId) {
      return NextResponse.json(
        { success: false, message: "targetType and targetId are required" },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/favorites?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, message: errorData.message || "Failed to remove favorite" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, message: data.message || "Removed from favorites" });
  } catch (error) {
    console.error("Remove favorite API error:", error);
    return NextResponse.json({ success: false, message: "Failed to remove favorite" }, { status: 500 });
  }
}
