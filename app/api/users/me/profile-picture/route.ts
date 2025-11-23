import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return request.cookies.get("auth_token")?.value || null;
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    
    // Try multiple field names that frontend might send
    const image = (formData.get("profilePicture") || formData.get("image") || formData.get("file")) as File;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "No profile picture file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // Upload to backend using profilePicture field
    const backendFormData = new FormData();
    backendFormData.append("profilePicture", image);

    const response = await fetch(`${config.backendUrl}/api/users/me/profile-picture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Profile picture upload failed" }));
      console.error('[Profile Picture Upload] Backend error:', errorData);
      throw new Error(errorData.message || "Profile picture upload failed");
    }
    
    const data = await response.json();

    // Extract URL from backend response
    const extractedUrl = data.profilePictureUrl || data.imageUrl || data.url;

    if (!extractedUrl) {
      throw new Error("No image URL returned from server");
    }

    return NextResponse.json({
      success: true,
      data: { 
        imageUrl: extractedUrl,
        profilePictureUrl: extractedUrl
      },
    });
  } catch (error) {
    console.error("Profile picture upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Profile picture upload failed",
      },
      { status: 500 }
    );
  }
}

// Optional: Add PUT method for updating profile picture
export async function PUT(request: NextRequest) {
  return POST(request); // Reuse POST logic for PUT
}


