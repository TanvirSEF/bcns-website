import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const CF_ACCOUNT_ID = process.env.CF_IMAGES_ACCOUNT_ID;
    const CF_IMAGES_TOKEN = process.env.CF_IMAGES_TOKEN;

    if (!CF_ACCOUNT_ID || !CF_IMAGES_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudflare Images credentials are not configured on the server.",
        },
        { status: 500 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const upstreamForm = new FormData();
    upstreamForm.append("file", file);

    const uploadRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_IMAGES_TOKEN}`,
        },
        body: upstreamForm,
      }
    );

    const data = await uploadRes.json();
    if (!uploadRes.ok || !data?.success) {
      return NextResponse.json(
        {
          success: false,
          message: data?.errors?.[0]?.message || "Upload failed",
        },
        { status: uploadRes.status }
      );
    }

    const result = data.result;
    const url: string | undefined = Array.isArray(result?.variants)
      ? result.variants[0]
      : undefined;

    return NextResponse.json(
      {
        success: true,
        id: result?.id,
        url,
        variants: result?.variants,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
