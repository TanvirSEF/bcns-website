import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/publications - Get all publications
export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(`${config.backendUrl}/api/publications`, {
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
          message: errorData.message || "Failed to fetch publications",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    let publications = [];
    if (Array.isArray(data)) {
      publications = data;
    } else if (data.publications) {
      publications = data.publications;
    } else if (data.data) {
      publications = Array.isArray(data.data) ? data.data : [];
    }

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

    // Map to frontend format with user names
    const formattedPublications = await Promise.all(
      publications.map(async (pub: any) => {
        // Extract ID from MongoDB format (remove _id from response)
        const id = pub._id?.$oid || pub._id || pub.id || "";
        
        // Extract date from MongoDB format
        const createdAt = pub.createdAt?.$date 
          ? new Date(pub.createdAt.$date).toISOString()
          : pub.createdAt 
          ? new Date(pub.createdAt).toISOString()
          : new Date().toISOString();
        
        // Get uploader name
        const uploadedBy = pub.uploadedBy;
        const author = await getUserName(uploadedBy);
        
        return {
          id,
          title: pub.title || "",
          content: pub.description || pub.content || "",
          author,
          tags: pub.tags || pub.categories || [],
          category: pub.category || "",
          fileUrl: pub.fileUrl || pub.file || "",
          createdAt,
          publishedAt: pub.publishedAt?.$date 
            ? new Date(pub.publishedAt.$date).toISOString()
            : pub.publishedAt 
            ? new Date(pub.publishedAt).toISOString()
            : createdAt,
          // Note: updatedAt and _id are intentionally excluded
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: formattedPublications,
    });
  } catch (error) {
    console.error("Publications API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch publications" },
      { status: 500 }
    );
  }
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
    
    // Extract form fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const file = formData.get("file") as File;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, message: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, message: "PDF file is required" },
        { status: 400 }
      );
    }

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, message: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Forward to backend API
    const backendFormData = new FormData();
    backendFormData.append("title", title);
    backendFormData.append("description", description);
    backendFormData.append("category", category);
    backendFormData.append("file", file);

    const response = await fetch(`${config.backendUrl}/api/publications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to create publication" }));
      
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to create publication",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: data.message || "Publication created successfully",
    });
  } catch (error) {
    console.error("Create publication API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create publication",
      },
      { status: 500 }
    );
  }
}

