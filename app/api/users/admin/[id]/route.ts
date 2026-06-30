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

// PATCH /api/users/admin/:id — admin updates a user's full profile
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/users/admin/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to update user",
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Normalize response shape + map Mongo _id -> id for frontend compatibility
    let user = data.user || data.data?.user || data.data || data;
    if (user && user._id && !user.id) {
      user = { ...user, id: user._id };
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: data.message || "User updated successfully",
    });
  } catch (error) {
    console.error("Admin update user API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to update user",
      },
      { status: getErrorStatusCode(error) },
    );
  }
}
