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

// GET /api/search?q=... - Global search (Admin only)
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({ success: true, data: { events: [], publications: [], users: [] } });
    }

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/search?q=${encodeURIComponent(q)}`,
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
        { success: false, message: errorData.message || "Search failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results = data.data || data;

    // Flatten into a unified search-results array with type labels
    const formatted: Array<{
      id: string;
      type: string;
      title: string;
      description: string;
      lastUpdated: string;
    }> = [];

    (results.events || []).forEach((e: any) => {
      formatted.push({
        id: e._id || e.id || "",
        type: "event",
        title: e.title || "Untitled Event",
        description: e.description || e.location || "",
        lastUpdated: e.date || e.createdAt || "",
      });
    });

    (results.publications || []).forEach((p: any) => {
      formatted.push({
        id: p._id || p.id || "",
        type: "publication",
        title: p.title || "Untitled Publication",
        description: p.description || p.category || "",
        lastUpdated: p.createdAt || "",
      });
    });

    (results.users || []).forEach((u: any) => {
      formatted.push({
        id: u._id || u.id || "",
        type: "user",
        title: u.name || "Unknown Member",
        description: u.email || u.affiliation || "",
        lastUpdated: "",
      });
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Search API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    return NextResponse.json(
      { success: false, message: errorMessage || "Search failed" },
      { status: statusCode }
    );
  }
}
