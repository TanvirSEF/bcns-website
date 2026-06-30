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

// PATCH /api/users/admin/:id/documents/:documentIndex/status
// Body: { status: "approved" | "rejected" | "pending", rejectionReason?: string }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentIndex: string }> },
) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id: userId, documentIndex } = await params;
    const body = await request.json().catch(() => ({}));

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/users/admin/${userId}/documents/${documentIndex}/status`,
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
          message: errorData.message || "Failed to update document status",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const result = data.data ?? data;

    return NextResponse.json({
      success: true,
      data: result,
      message: data.message || "Document status updated",
    });
  } catch (error) {
    console.error("Update document status API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to update document status",
      },
      { status: getErrorStatusCode(error) },
    );
  }
}
