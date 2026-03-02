import { NextRequest, NextResponse } from "next/server";
import config from "@/lib/config";

function getToken(request: NextRequest): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }
    return request.cookies.get("auth_token")?.value || null;
}

// DELETE /api/gallery/albums/[albumId] - Delete an album
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ albumId: string }> }
) {
    try {
        const token = getToken(request);

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { albumId } = await params;

        if (!albumId) {
            return NextResponse.json(
                { success: false, message: "Album ID is required" },
                { status: 400 }
            );
        }

        const response = await fetch(`${config.backendUrl}/api/gallery/albums/${albumId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                {
                    success: false,
                    message: errorData.message || "Failed to delete album",
                },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Album deleted successfully",
        });
    } catch (error) {
        console.error("Delete album API error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete album" },
            { status: 500 }
        );
    }
}
