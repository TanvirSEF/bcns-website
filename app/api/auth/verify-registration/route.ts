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
    if (!body.name || !body.email || !body.password || !body.otp) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Name, email, password, and OTP are required" 
        },
        { 
          status: 400,
          headers: corsHeaders 
        }
      );
    }

    // Construct the backend URL
    const backendUrl = config.backendUrl;
    const verifyEndpoint = `${backendUrl}/api/auth/verify-registration`;

    // Build payload with all membership fields
    const verificationPayload: any = {
      name: body.name,
      email: body.email,
      password: body.password,
      otp: body.otp.toString().trim(), // Ensure OTP is string and trimmed
    };

    // Add all membership form fields if provided
    if (body.formNo !== undefined) verificationPayload.formNo = body.formNo;
    if (body.refNo !== undefined) verificationPayload.refNo = body.refNo;
    if (body.phone !== undefined) verificationPayload.phone = body.phone;
    if (body.affiliation !== undefined) verificationPayload.affiliation = body.affiliation;
    if (body.mailingAddress !== undefined) verificationPayload.mailingAddress = body.mailingAddress;
    if (body.permanentAddress !== undefined) verificationPayload.permanentAddress = body.permanentAddress;
    
    // Education Qualifications
    if (body.educationQualifications && Array.isArray(body.educationQualifications)) {
      verificationPayload.educationQualifications = body.educationQualifications;
    }
    
    // Training
    if (body.training && Array.isArray(body.training)) {
      verificationPayload.training = body.training;
    }
    
    // Research Interests
    if (body.primaryResearchInterest !== undefined) verificationPayload.primaryResearchInterest = body.primaryResearchInterest;
    if (body.secondaryResearchInterest !== undefined) verificationPayload.secondaryResearchInterest = body.secondaryResearchInterest;


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

      // CRITICAL: Do not proceed with registration if OTP is invalid
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

    // Check if we have an access token for successful registration
    if (!data.accessToken && !data.token) {
      
      // If user was successfully registered but no token, we need to handle this
      // For now, we'll proceed with the user data and let the frontend handle login
      return NextResponse.json(
        {
          success: true,
          data: {
            user: data.user || {
              id: data.id || "temp",
              email: body.email,
              name: body.name,
              role: "member",
              membershipStatus: "active",
              educationQualifications: [],
              training: [],
              eventsAttended: 0,
              eventsThisMonth: 0,
              publicationsRead: 0,
              publicationsThisWeek: 0,
              networkConnections: 0,
              newConnections: 0
            },
            token: null, // No token available
            expiresIn: 0,
            refreshToken: null,
            requiresLogin: true // Flag to indicate user needs to login
          },
        },
        {
          headers: corsHeaders
        }
      );
    }

    // Transform the response to match our frontend expectations
    const transformedData = {
      user: data.user || {
        // If no user data, create placeholder with request data
        id: data.id || "temp",
        email: body.email,
        name: body.name,
        role: "member",
        membershipStatus: "active",
        educationQualifications: [],
        training: [],
        eventsAttended: 0,
        eventsThisMonth: 0,
        publicationsRead: 0,
        publicationsThisWeek: 0,
        networkConnections: 0,
        newConnections: 0
      },
      token: data.accessToken || data.token, // Support both field names
      expiresIn: data.expiresIn || 3600, // Default to 1 hour if not provided
      refreshToken: data.refreshToken
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
