import { NextRequest, NextResponse } from "next/server";

import config from "@/lib/config";

// Backend user response interface
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

    const response = await fetch(
      `${config.backendUrl}/api/users/list?role=member`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();

    // Handle different response structures from backend
    let members = [];
    if (Array.isArray(data)) {
      members = data;
    } else if (data.users) {
      members = data.users;
    } else if (data.data) {
      members = data.data;
    }

    // Map to frontend format
    const formattedMembers = members.map((user: BackendUser) => ({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.mailingAddress || user.address,
      bio: user.bio,
      profilePictureUrl: user.profilePictureUrl || user.profile_picture_url,
      createdAt: user.createdAt || user.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedMembers,
    });
  } catch (error) {
    console.error("Members API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
