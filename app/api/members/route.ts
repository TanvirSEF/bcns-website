import { NextRequest, NextResponse } from "next/server";

interface BackendUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePictureUrl?: string;
  createdAt?: string;
}

interface BackendResponse {
  success: boolean;
  users?: BackendUser[];
  data?: BackendUser[];
  message?: string;
  total?: number;
}

function buildAuthHeader(request: NextRequest): string | undefined {
  let authHeader = request.headers.get("authorization") || undefined;
  if (!authHeader) {
    const cookieToken = request.cookies.get("auth_token")?.value;
    if (cookieToken) authHeader = `Bearer ${cookieToken}`;
  }
  return authHeader;
}

// Development-only logging utility
function logDebug(message: string, data?: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '');
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = buildAuthHeader(request);
    logDebug("Members API - Auth Header", authHeader ? "Present" : "Missing");
    
    if (!authHeader) {
      logDebug("Members API - No authorization header");
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    // Use the correct endpoint from the API documentation
    let response: Response;
    let data: BackendResponse;
    
    try {
      logDebug("Members API - Fetching from backend");
      
      // Use the /api/users/list endpoint for authenticated users (limited data)
      response = await fetch("https://api.tanvirmern.com/api/users/list", {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });
      
      logDebug("Members API - Response status", response.status);
      
      if (response.ok) {
        data = await response.json() as BackendResponse;
        logDebug("Members API - Response data", data);
      } else {
        logDebug("Members API - Endpoint failed", response.status);
        const errorText = await response.text();
        logDebug("Members API - Error response", errorText);
        
        return NextResponse.json({ 
          success: false, 
          message: `Backend API error: ${response.status}`,
          error: errorText
        }, {
          status: response.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }
    } catch (fetchError) {
      console.error("Members API - Fetch error:", fetchError);
      return NextResponse.json({ 
        success: false, 
        message: "Failed to connect to backend API",
        error: fetchError instanceof Error ? fetchError.message : "Unknown error"
      }, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    // Process the response data
    let members: BackendUser[] = [];
    if (data) {
      logDebug("Members API - Processing data structure");
      
      if (Array.isArray(data)) {
        logDebug("Members API - Data is direct array", data.length);
        members = data as BackendUser[];
      } else if (data.users && Array.isArray(data.users)) {
        logDebug("Members API - Data has users property", data.users.length);
        members = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        logDebug("Members API - Data.data is array", data.data.length);
        members = data.data;
      }
      
      logDebug("Members API - Final members array", members.map(m => ({ 
        id: m._id || m.id, 
        name: m.name, 
        role: m.role,
        email: m.email 
      })));
    }
    
    logDebug("Members API - Returning response", `${members.length} members`);
    
    return NextResponse.json({ 
      success: true, 
      members,
      total: members.length 
    }, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Members API - Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
