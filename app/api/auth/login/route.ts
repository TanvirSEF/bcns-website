import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(
      `${process.env.BACKEND_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error("External API error:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });

      const errorData = await response
        .text()
        .catch(() => "Unable to read error response");
      console.error("External API error response:", errorData);

      return NextResponse.json(
        {
          success: false,
          message: `External API error: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Capture upstream Set-Cookie and persist it on our domain so we can
    // forward it later for cookie-based sessions
    const setCookieHeader = response.headers.get("set-cookie");

    const nextRes = NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

    // If API returned a JWT token, set it as httpOnly cookie for SSR safety
    type UpstreamAuth = { accessToken?: string; token?: string };
    const tokenSource = data as UpstreamAuth;
    const token = tokenSource.accessToken || tokenSource.token;
    if (token) {
      nextRes.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    if (setCookieHeader) {
      // Store the raw upstream cookie string in a httpOnly cookie on our domain
      // encoded as base64 so we can forward it on future requests
      const encoded = Buffer.from(setCookieHeader).toString("base64");
      nextRes.cookies.set("upstream_session", encoded, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      });
    }

    return nextRes;
  } catch (error) {
    console.error("Proxy login error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            message: "Request timeout - external API is not responding",
          },
          { status: 504 }
        );
      }

      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { success: false, message: "Unable to connect to external API" },
          { status: 503 }
        );
      }
    }

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
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
