import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

interface BackendAlbum {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  coverPhoto?: string;
  photoCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/gallery/albums - Get all albums
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${config.backendUrl}/api/gallery/albums`, {
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
          message: errorData.message || "Failed to fetch albums",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let albums = [];
    if (Array.isArray(data)) {
      albums = data;
    } else if (data.albums) {
      albums = data.albums;
    } else if (data.data) {
      albums = Array.isArray(data.data) ? data.data : [];
    }

    // Map to frontend format
    const formattedAlbums = albums.map((album: BackendAlbum) => ({
      id: album._id || album.id || "",
      title: album.title,
      description: album.description || "",
      coverPhoto: album.coverPhoto || undefined,
      photoCount: album.photoCount || 0,
      createdAt: album.createdAt || new Date().toISOString(),
      updatedAt: album.updatedAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedAlbums,
    });
  } catch (error) {
    console.error("Albums API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch albums" },
      { status: 500 }
    );
  }
}

// POST /api/gallery/albums - Create new album
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, coverPhoto } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${config.backendUrl}/api/gallery/albums`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description: description || "",
        coverPhoto: coverPhoto || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to create album",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures
    const album = data.album || data.data || data;

    const formattedAlbum = {
      id: album._id || album.id || "",
      title: album.title,
      description: album.description || "",
      coverPhoto: album.coverPhoto || undefined,
      photoCount: album.photoCount || 0,
      createdAt: album.createdAt || new Date().toISOString(),
      updatedAt: album.updatedAt || new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedAlbum,
    });
  } catch (error) {
    console.error("Create album API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create album" },
      { status: 500 }
    );
  }
}

