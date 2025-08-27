import { NextRequest, NextResponse } from "next/server";
import { fetchFromBackend, getAuthHeader } from "@/lib/server-utils";
import type { BackendUser, BackendResponse } from "@/lib/types";

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

    // Use environment variable for backend URL
    const apiEndpoint = `${process.env.BACKEND_API_URL}/api/users/list`;

    // Use the correct endpoint from the API documentation
    let data: BackendResponse;

    try {
      // Always fetch only members for security
      const backendUrl = new URL(apiEndpoint);
      backendUrl.searchParams.append("role", "member");

      // Use the /api/users/list endpoint for authenticated users (limited data)
      data = await fetchFromBackend<BackendResponse>(
        backendUrl.pathname + backendUrl.search,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
          },
        }
      );
    } catch (fetchError) {
      console.error("Members API - Fetch error:", fetchError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to backend API",
          error:
            fetchError instanceof Error ? fetchError.message : "Unknown error",
        },
        {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // Process the response data
    let members: BackendUser[] = [];
    if (data) {
      if (Array.isArray(data)) {
        members = data as BackendUser[];
      } else if (data.users && Array.isArray(data.users)) {
        members = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        members = data.data;
      }

      // Map backend fields to frontend expected fields
      members = members.map((user) => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.mailingAddress, // Map mailingAddress to address
        bio: user.bio,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      }));
    }

    return NextResponse.json(
      {
        success: true,
        members,
        total: members.length,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("Members API - Error:", error);
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
