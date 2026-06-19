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

// GET /api/logs - Fetch admin activity logs (Admin only)
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Forward query params
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "100";
    const skip = searchParams.get("skip") || "0";

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/logs/activity?limit=${limit}&skip=${skip}`,
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
        {
          success: false,
          message: errorData.message || "Failed to fetch logs",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    let rawLogs: any[] = [];
    if (Array.isArray(data)) {
      rawLogs = data;
    } else if (data.logs) {
      rawLogs = data.logs;
    } else if (data.data) {
      rawLogs = Array.isArray(data.data) ? data.data : [];
    }

    // Normalize each log to the frontend ActivityLog shape
    const formattedLogs = rawLogs.map((log: any) => {
      const adminUser =
        typeof log.adminUserId === "object" && log.adminUserId !== null
          ? log.adminUserId
          : null;

      const action = log.action || "unknown";
      const resource = log.resource || "";
      const combinedAction = resource ? `${action}_${resource}` : action;

      return {
        id: log._id?.$oid || log._id || log.id || "",
        action: combinedAction,
        description: log.description || `${action} ${resource}`.trim(),
        userId: adminUser?._id?.$oid || adminUser?._id || String(log.adminUserId || ""),
        userEmail: adminUser?.email || "",
        userName: adminUser?.name || "",
        createdAt: log.createdAt?.$date
          ? new Date(log.createdAt.$date).toISOString()
          : log.createdAt
          ? new Date(log.createdAt).toISOString()
          : new Date().toISOString(),
        ipAddress: log.ipAddress || "",
        userAgent: log.userAgent || "",
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedLogs,
    });
  } catch (error) {
    console.error("Logs API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage || "Failed to fetch logs",
      },
      { status: statusCode }
    );
  }
}
