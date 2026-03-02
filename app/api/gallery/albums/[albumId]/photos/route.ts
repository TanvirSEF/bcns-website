import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

function normalizeId(idInfo: any): string {
  if (!idInfo) return "";
  if (typeof idInfo === "string") {
    return idInfo === "undefined" || idInfo === "null" ? "" : idInfo;
  }
  if (typeof idInfo === "object") {
    if (idInfo.$oid) return String(idInfo.$oid);
    if (idInfo.toString && typeof idInfo.toString === "function") {
      const str = idInfo.toString();
      return str === "[object Object]" ? "" : str;
    }
  }
  return String(idInfo);
}

function normalizeDate(dateInfo: any): string {
  if (!dateInfo) return new Date().toISOString();
  if (typeof dateInfo === "string") return dateInfo;
  if (typeof dateInfo === "object" && dateInfo.$date) return dateInfo.$date;
  return new Date().toISOString();
}

// GET /api/gallery/albums/[albumId]/photos - Get all photos in an album
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { albumId } = await params;

    if (!albumId) {
      return NextResponse.json(
        { success: false, message: "Album ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/gallery/albums/${albumId}/photos`,
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
          message: errorData.message || "Failed to fetch photos",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`[DEBUG] Photos backend response for album ${albumId}:`, JSON.stringify(data).slice(0, 500));

    // Handle different response structures
    let rawPhotos = [];
    if (Array.isArray(data)) {
      rawPhotos = data;
    } else if (data.data && Array.isArray(data.data)) {
      rawPhotos = data.data;
    } else if (data.photos && Array.isArray(data.photos)) {
      rawPhotos = data.photos;
    } else if (data.data && data.data.photos && Array.isArray(data.data.photos)) {
      rawPhotos = data.data.photos;
    }

    // Map to frontend format with extremely robust ID extraction
    const formattedPhotos = rawPhotos.map((photo: any, index: number) => {
      // Try to find the ID in various common fields
      const idSource = photo._id || photo.id || photo.pk || photo.key;
      const id = normalizeId(idSource) || `p-${index}-${Date.now().toString().slice(-6)}`;

      return {
        id,
        title: photo.caption || photo.title || "",
        description: photo.description || "",
        imageUrl: photo.imageUrl || photo.image_url || photo.url || "",
        albumId: normalizeId(photo.albumId || photo.album) || albumId,
        uploadedBy: normalizeId(photo.uploadedBy) || "",
        createdAt: normalizeDate(photo.createdAt || photo.created_at),
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPhotos,
    });
  } catch (error) {
    console.error("Photos API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

// POST /api/gallery/albums/[albumId]/photos - Upload photo to album
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { albumId } = await params;

    if (!albumId) {
      return NextResponse.json(
        { success: false, message: "Album ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Get file or image URL
    const photoFile = formData.get("photo") as File | null;
    const imageUrl = formData.get("imageUrl") as string | null;
    const caption = formData.get("caption") as string | null;

    // Validate: either file or imageUrl must be provided
    if (!photoFile && !imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Either photo file or image URL is required",
        },
        { status: 400 }
      );
    }

    // If file is provided, validate it
    if (photoFile) {
      // Validate file type
      if (!photoFile.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Only images are allowed.",
          },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB as per backend spec)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (photoFile.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: "File size too large. Maximum 5MB allowed.",
          },
          { status: 400 }
        );
      }

      // Validate file extension (png, jpeg, jpg, gif)
      const allowedExtensions = ['.png', '.jpeg', '.jpg', '.gif'];
      const fileName = photoFile.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      if (!hasValidExtension) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file type. Only PNG, JPEG, JPG, and GIF are allowed.",
          },
          { status: 400 }
        );
      }
    }

    // Prepare FormData for backend
    const backendFormData = new FormData();
    if (photoFile) {
      backendFormData.append("photo", photoFile);
    }
    if (imageUrl) {
      backendFormData.append("imageUrl", imageUrl);
    }
    if (caption) {
      backendFormData.append("caption", caption);
    }

    const response = await fetch(
      `${config.backendUrl}/api/gallery/albums/${albumId}/photos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: backendFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to upload photo",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    const photo = data.photo || data.data || data;

    // Extract imageUrl from various possible fields
    const extractedImageUrl = photo.imageUrl || photo.image_url || photo.url || imageUrl || "";

    // Robust ID extraction for POST response
    const idSource = photo._id || photo.id || photo.pk || photo.key;
    const id = normalizeId(idSource) || `p-new-${Date.now().toString().slice(-6)}`;

    const formattedPhoto = {
      id,
      title: photo.caption || photo.title || "",
      description: photo.description || "",
      imageUrl: extractedImageUrl,
      albumId: normalizeId(photo.albumId || photo.album) || albumId,
      uploadedBy: normalizeId(photo.uploadedBy) || "",
      createdAt: normalizeDate(photo.createdAt || photo.created_at),
    };

    return NextResponse.json({
      success: true,
      data: formattedPhoto,
    });
  } catch (error) {
    console.error("Upload photo API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/albums/[albumId]/photos - Delete a photo from album
// Note: We expect the photoId as a query parameter or in the backend URL
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { albumId } = await params;
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!albumId || !photoId) {
      return NextResponse.json(
        { success: false, message: "Album ID and Photo ID are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/gallery/albums/${albumId}/photos/${photoId}`,
      {
        method: "DELETE",
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
          message: errorData.message || "Failed to delete photo",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Delete photo API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

