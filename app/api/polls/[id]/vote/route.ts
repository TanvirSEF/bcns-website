import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// POST /api/polls/:id/vote - Submit vote (User only)
export async function POST(
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Poll ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.optionId) {
      return NextResponse.json(
        { success: false, message: "optionId is required" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(
      `${config.backendUrl}/api/polls/${id}/vote`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          optionId: body.optionId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to submit vote" }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to submit vote",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || "Vote submitted successfully",
    });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit vote",
      },
      { status: 500 }
    );
  }
}

