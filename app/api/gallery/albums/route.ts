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

    // Handle different response structures
    let rawAlbums = [];
    if (Array.isArray(data)) {
      rawAlbums = data;
    } else if (data.data && Array.isArray(data.data)) {
      rawAlbums = data.data;
    } else if (data.albums && Array.isArray(data.albums)) {
      rawAlbums = data.albums;
    }

    // Map to frontend format
    const formattedAlbums = rawAlbums.map((album: any, index: number) => {
      const idSource = album._id || album.id || album.pk || album.key;
      const id = normalizeId(idSource) || `a-${index}-${Date.now().toString().slice(-6)}`;

      return {
        id,
        title: album.title,
        description: album.description || "",
        coverPhoto: album.coverPhoto || album.cover_photo || undefined,
        photoCount: album.photoCount || album.photo_count || 0,
        createdAt: normalizeDate(album.createdAt || album.created_at),
        updatedAt: normalizeDate(album.updatedAt || album.updated_at),
      };
    });

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
    const idSource = album._id || album.id || album.pk || album.key;
    const id = normalizeId(idSource) || `a-new-${Date.now().toString().slice(-6)}`;

    const formattedAlbum = {
      id,
      title: album.title,
      description: album.description || "",
      coverPhoto: album.coverPhoto || album.cover_photo || undefined,
      photoCount: album.photoCount || album.photo_count || 0,
      createdAt: normalizeDate(album.createdAt || album.created_at),
      updatedAt: normalizeDate(album.updatedAt || album.updated_at),
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

