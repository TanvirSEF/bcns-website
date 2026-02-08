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
  affiliation?: string;
  designation?: string;
  mailingAddress?: string;
  permanentAddress?: string;
  address?: string;
  bio?: string;
  profilePictureUrl?: string;
  profile_picture_url?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  approvalStatus?: string;
  isEmailVerified?: boolean;
  membershipStatus?: string;
  membershipType?: 'general' | 'lifetime';
  memberId?: string;
  primaryResearchInterest?: string;
  secondaryResearchInterest?: string;
  educationQualifications?: Array<{
    qualification: string;
    year: string;
    institution: string;
  }>;
  training?: Array<{
    period: string;
    institute: string;
  }>;
  documents?: Array<{
    _id?: string;
    id?: string;
    title?: string;
    fileUrl?: string;
    status?: string;
    uploadedAt?: string;
    createdAt?: string;
  }>;
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

    // Get optional role filter from query params
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");

    // Build backend URL with optional role filter
    let backendUrl = `${config.backendUrl}/api/users`;
    if (role) {
      backendUrl += `?role=${encodeURIComponent(role)}`;
    }

    const response = await fetchWithTimeout(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch users",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let users = [];
    if (Array.isArray(data)) {
      users = data;
    } else if (data.users) {
      users = data.users;
    } else if (data.data) {
      users = Array.isArray(data.data) ? data.data : [];
    }

    // Map to frontend format
    const formattedUsers = users.map((user: BackendUser) => {
      return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || "member",
        phone: user.phone || "",
        affiliation: user.affiliation || "",
        mailingAddress: user.mailingAddress || user.address || "",
        permanentAddress: user.permanentAddress || "",
        bio: user.bio || "",
        profilePictureUrl: user.profilePictureUrl || user.profile_picture_url,
        createdAt: user.createdAt || user.created_at,
        updatedAt: user.updatedAt || user.updated_at,
        approvalStatus: user.approvalStatus || "approved",
        isEmailVerified: user.isEmailVerified || false,
        membershipStatus: user.membershipStatus || "active",
        membershipType: user.membershipType,
        memberId: user.memberId,
        primaryResearchInterest: user.primaryResearchInterest || "",
        secondaryResearchInterest: user.secondaryResearchInterest || "",
        educationQualifications: user.educationQualifications || [],
        training: user.training || [],
        documents: user.documents || [],
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Users API error:", error);
    const errorMessage = getErrorMessage(error);
    const statusCode = getErrorStatusCode(error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage || "Failed to fetch users" 
      },
      { status: statusCode }
    );
  }
}

