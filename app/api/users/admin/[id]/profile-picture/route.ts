import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// POST /api/users/admin/:id/profile-picture — admin uploads a member's photo
export async function POST(
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
    const formData = await request.formData();

    const image = (formData.get("profilePicture") ||
      formData.get("image") ||
      formData.get("file")) as File;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "No profile picture file provided" },
        { status: 400 },
      );
    }
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Invalid file type. Only images are allowed." },
        { status: 400 },
      );
    }
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "File size too large. Maximum 5MB allowed." },
        { status: 400 },
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("profilePicture", image);

    const response = await fetch(
      `${config.backendUrl}/api/users/admin/${id}/profile-picture`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: backendFormData,
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Profile picture upload failed" }));
      return NextResponse.json(
        { success: false, message: errorData.message || "Profile picture upload failed" },
        { status: response.status },
      );
    }

    const data = await response.json();
    const extractedUrl =
      data.profilePictureUrl || data.imageUrl || data.url || data.data?.profilePictureUrl;

    if (!extractedUrl) {
      return NextResponse.json(
        { success: false, message: "No image URL returned from server" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      data: { imageUrl: extractedUrl, profilePictureUrl: extractedUrl },
    });
  } catch (error) {
    console.error("Admin profile picture upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Profile picture upload failed",
      },
      { status: 500 },
    );
  }
}
