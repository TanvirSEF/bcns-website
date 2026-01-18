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

        // Validate required fields - profilePicture is required
        if (!body.profilePicture || !body.profilePicture.filename || !body.profilePicture.contentType) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Profile picture information is required"
                },
                {
                    status: 400,
                    headers: corsHeaders
                }
            );
        }

        // Validate documents if provided (optional)
        if (body.documents && !Array.isArray(body.documents)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Documents must be an array"
                },
                {
                    status: 400,
                    headers: corsHeaders
                }
            );
        }

        // Construct the backend URL
        const backendUrl = config.backendUrl;
        const getUploadUrlsEndpoint = `${backendUrl}/api/auth/get-upload-urls`;

        // Forward the request to the backend
        const response = await fetch(getUploadUrlsEndpoint, {
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
                    message: "Invalid response from server"
                },
                {
                    status: 502,
                    headers: corsHeaders
                }
            );
        }

        if (!response.ok) {
            const errorMessage = data?.message || data?.error || "Failed to get upload URLs";

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

        // Return successful response
        return NextResponse.json(
            data,
            {
                headers: corsHeaders
            }
        );

    } catch (error) {
        // Determine error type and provide user-friendly message
        let errorMessage = "Unable to get upload URLs";
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
