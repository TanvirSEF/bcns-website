import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Construct the backend URL
    const backendUrl = config.backendUrl;
    const loginEndpoint = `${backendUrl}/api/auth/login`;

    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid response from authentication server" 
        },
        { 
          status: 502,
          headers: corsHeaders 
        }
      );
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || "Login failed";

      return NextResponse.json(
        {
          success: false,
          message: errorMessage
        },
        {
          status: response.status,
          headers: corsHeaders
        }
      );
    }

    // Handle successful response - transform backend format to frontend format
    // Check if we have an access token
    if (!data.accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed - no access token received"
        },
        {
          status: 401,
          headers: corsHeaders
        }
      );
    }

    // Transform the response to match our frontend expectations
    const transformedData = {
      user: data.user || {
        // If no user data, create placeholder with request email
        id: "temp",
        email: body.email,
        name: "User",
        role: "member"
      },
      token: data.accessToken, // Transform accessToken to token
      expiresIn: data.expiresIn || 3600, // Default to 1 hour if not provided
      isTwoFactorRequired: data.isTwoFactorRequired || false
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedData,
      },
      {
        headers: corsHeaders
      }
    );

  } catch (error) {
    // Determine error type and provide user-friendly message
    let errorMessage = "Unable to process login request";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = "Unable to connect to authentication server";
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = "Authentication server is taking too long to respond";
        statusCode = 504;
      } else if (error.message.includes('JSON')) {
        errorMessage = "Invalid request format";
        statusCode = 400;
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage
      },
      {
        status: statusCode,
        headers: corsHeaders
      }
    );
  }
}
