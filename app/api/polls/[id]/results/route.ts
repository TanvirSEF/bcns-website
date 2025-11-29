import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return request.cookies.get("auth_token")?.value || null;
}

// GET /api/polls/:id/results - Get poll results (Public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getToken(request);
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Poll ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendUrl}/api/polls/${id}/results`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to fetch poll results",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle different response structures from backend
    const poll = data.poll || data.data || data;

    // Extract ID from MongoDB format
    const pollId = poll._id?.$oid || poll._id || poll.id || "";
    
    // Map options with votes
    const options = (poll.options || []).map((opt: any) => ({
      id: opt._id?.$oid || opt._id || opt.id || "",
      text: opt.name || opt.text || "",
      votes: opt.votes || 0,
    }));

    // Calculate total votes
    const totalVotes = options.reduce((sum: number, opt: any) => sum + opt.votes, 0);

    // Map to frontend format
    const formattedResults = {
      id: pollId,
      question: poll.title || poll.question || "",
      description: poll.description || "",
      options: options.map((opt: any) => ({
        ...opt,
        percentage: totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0,
      })),
      totalVotes,
      createdAt: poll.createdAt?.$date 
        ? new Date(poll.createdAt.$date).toISOString()
        : poll.createdAt 
        ? new Date(poll.createdAt).toISOString()
        : new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedResults,
    });
  } catch (error) {
    console.error("Poll results API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch poll results" },
      { status: 500 }
    );
  }
}

