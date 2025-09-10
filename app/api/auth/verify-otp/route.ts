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

    // Validate required fields
    if (!body.email || !body.otp) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Email and OTP are required" 
        },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    // Construct the backend URL
    const backendUrl = config.backendUrl;
    const verifyEndpoint = `${backendUrl}/api/auth/verify-otp`;

    // Only send email and OTP for verification
    const verificationPayload = {
      email: body.email,
      otp: body.otp.toString().trim() // Ensure OTP is string and trimmed
    };


    const response = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(verificationPayload),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid response from server" 
        },
        { 
          status: 502,
          headers: corsHeaders 
        }
      );
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || "OTP verification failed";

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          details: data,
          error: 'OTP_VALIDATION_FAILED'
        },
        {
          status: response.status,
          headers: corsHeaders
        }
      );
    }

    // OTP is valid, return success

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
        data: {
          email: body.email,
          otpValid: data.isValid || true // Handle both isValid and otpValid
        }
      },
      {
        headers: corsHeaders
      }
    );

  } catch (error) {
    // Determine error type and provide user-friendly message
    let errorMessage = "Unable to verify OTP";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        errorMessage = "Unable to connect to server";
        statusCode = 503;
      } else if (error.message.includes('timeout')) {
        errorMessage = "Server is taking too long to respond";
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
