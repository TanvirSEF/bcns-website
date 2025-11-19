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
    // 1. Receive formData from frontend
    const incomingFormData = await request.formData();

    // 2. Create a NEW FormData object to ensure clean data transmission
    // This fixes issues where direct proxying of FormData in Node environment fails
    const outgoingFormData = new FormData();

    // Copy all fields manually
    for (const [key, value] of incomingFormData.entries()) {
      outgoingFormData.append(key, value);
    }

    // 3. Backend Endpoint
    const backendUrl = config.backendUrl;
    const verifyEndpoint = `${backendUrl}/api/auth/verify-registration`;

    // 4. Send to Backend
    const response = await fetch(verifyEndpoint, {
      method: "POST",
      body: outgoingFormData, // Send the clean FormData
      headers: {
        // Do NOT set Content-Type here, fetch sets it with boundary automatically
        "Accept": "application/json",
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Response parsing error:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502, headers: corsHeaders }
      );
    }

    if (!response.ok) {
      // Handle backend validation errors
      const errorMessage = Array.isArray(data?.message) 
        ? data.message.join(', ') // If array of errors, join them
        : (data?.message || data?.error || "Verification failed");

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          details: data,
          error: 'VERIFICATION_FAILED'
        },
        { status: response.status, headers: corsHeaders }
      );
    }

    // 5. Success Response Handling
    const transformedData = {
      user: data.user || {
        id: data.id || "temp",
        email: incomingFormData.get('email')?.toString(),
        name: incomingFormData.get('name')?.toString(),
        role: "member",
      },
      token: data.accessToken || data.token,
      expiresIn: data.expiresIn || 3600,
      refreshToken: data.refreshToken
    };

    return NextResponse.json(
      { success: true, data: transformedData },
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Registration Proxy Error:", error);
    
    let errorMessage = "Unable to verify registration";
    let statusCode = 500;

    if (error.message && error.message.includes('fetch')) {
      errorMessage = "Unable to connect to backend server";
      statusCode = 503;
    }

    return NextResponse.json(
      { success: false, message: errorMessage, debug: error.message },
      { status: statusCode, headers: corsHeaders }
    );
  }
}