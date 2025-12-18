import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

// CORS headers for the response
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: 'Username is required',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Validate username format (lowercase, numbers, underscores only)
    const usernameRegex = /^[a-z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid username format',
          available: false,
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Construct the backend URL
    const backendUrl = config.backendUrl;
    const checkEndpoint = `${backendUrl}/api/users/check-username?username=${encodeURIComponent(username)}`;

    const response = await fetch(checkEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response from server',
          available: false,
        },
        {
          status: 502,
          headers: corsHeaders,
        }
      );
    }

    if (!response.ok) {
      // If username already exists (409 conflict), return available: false
      if (response.status === 409 || response.status === 400) {
        return NextResponse.json(
          {
            success: true,
            available: false,
            message: data?.message || 'Username is already taken',
          },
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: data?.message || 'Failed to check username availability',
          available: false,
        },
        {
          status: response.status,
          headers: corsHeaders,
        }
      );
    }

    // Username is available
    return NextResponse.json(
      {
        success: true,
        available: data?.available !== false, // Default to true if not specified
        message: data?.message || 'Username is available',
      },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Username check API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to check username availability',
        available: false,
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

