import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/publications/:id - Get single publication by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Publication ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/publications/${id}`,
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
          message: errorData.message || "Failed to fetch publication",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    const publication = data.publication || data.data || data;

    // Helper function to extract user name from uploadedBy
    const getUserName = async (uploadedBy: any): Promise<string> => {
      if (!uploadedBy) return "Unknown";
      
      // If backend already populated user data
      if (typeof uploadedBy === 'object' && uploadedBy.name) {
        return uploadedBy.name;
      }
      
      // Extract actual ID from MongoDB ObjectId format
      const actualUserId = typeof uploadedBy === 'object' && uploadedBy.$oid 
        ? uploadedBy.$oid 
        : typeof uploadedBy === 'string' 
        ? uploadedBy 
        : null;
      
      if (!actualUserId) return "Unknown";
      
      // Fetch user name from backend
      try {
        const userResponse = await fetch(
          `${config.backendUrl}/api/users/${actualUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.user || userData.data || userData;
          return user.name || "Unknown";
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
      
      return "Unknown";
    };

    // Extract ID from MongoDB format
    const pubId = publication._id?.$oid || publication._id || publication.id || "";
    
    // Extract date from MongoDB format
    const createdAt = publication.createdAt?.$date 
      ? new Date(publication.createdAt.$date).toISOString()
      : publication.createdAt 
      ? new Date(publication.createdAt).toISOString()
      : new Date().toISOString();
    
    // Get uploader name
    const uploadedBy = publication.uploadedBy;
    const author = await getUserName(uploadedBy);

    // Map to frontend format (removed updatedAt and _id)
    const formattedPublication = {
      id: pubId,
      title: publication.title || "",
      content: publication.description || publication.content || "",
      author,
      tags: publication.tags || publication.categories || [],
      category: publication.category || "",
      fileUrl: publication.fileUrl || publication.file || "",
      createdAt,
      publishedAt: publication.publishedAt?.$date 
        ? new Date(publication.publishedAt.$date).toISOString()
        : publication.publishedAt 
        ? new Date(publication.publishedAt).toISOString()
        : createdAt,
      // Note: updatedAt and _id are intentionally excluded
    };

    return NextResponse.json({
      success: true,
      data: formattedPublication,
    });
  } catch (error) {
    console.error("Publication API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}

// DELETE /api/publications/:id - Delete publication (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: publicationId } = await params;
    if (!publicationId) {
      return NextResponse.json(
        { success: false, message: "Publication ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/publications/${publicationId}`,
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
          message: errorData.message || "Failed to delete publication",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Publication deleted successfully" });
  } catch (error) {
    console.error("Delete publication API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete publication" },
      { status: 500 }
    );
  }
}

