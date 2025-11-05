import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";
import { fetchWithTimeout, getErrorMessage, getErrorStatusCode } from "@/lib/fetch-with-timeout";

interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  mailingAddress?: string;
  address?: string;
  bio?: string;
  profilePictureUrl?: string;
  profile_picture_url?: string;
  createdAt?: string;
  created_at?: string;
  status?: string;
  approvalStatus?: string;
}

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetchWithTimeout(
      `${config.backendUrl}/api/users/admin/pending`,
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
          message: errorData.message || "Failed to fetch pending users" 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let pendingUsers = [];
    if (Array.isArray(data)) {
      pendingUsers = data;
    } else if (data.users) {
      pendingUsers = data.users;
    } else if (data.data) {
      pendingUsers = Array.isArray(data.data) ? data.data : [];
    }

    // Map to frontend format
    const formattedUsers = pendingUsers.map((user: BackendUser) => ({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.mailingAddress || user.address,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl || user.profile_picture_url,
      createdAt: user.createdAt || user.created_at,
      status: user.status || user.approvalStatus || "pending",
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Pending users API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage || "Failed to fetch pending users" 
      },
      { status: statusCode }
    );
  }
}

