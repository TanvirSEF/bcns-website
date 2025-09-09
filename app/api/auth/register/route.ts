import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${config.backendUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || 
                          (Array.isArray(data.message) ? data.message.join(", ") : "Registration failed");
      
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
