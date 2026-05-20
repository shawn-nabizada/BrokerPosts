import { NextResponse } from "next/server";
import {
  handleUpload,
  type HandleUploadBody,
} from "@vercel/blob/client";
import { auth } from "@/auth";

export const runtime = "nodejs";

/**
 * Client-upload token endpoint for broker images (headshot, logo).
 *
 * The browser uploads directly to Vercel Blob (bypassing the 4.5 MB serverless
 * body limit). We authenticate here and scope every upload to the signed-in
 * user's own folder so one broker can't write into another's namespace.
 */
export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  const body = (await req.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`users/${userId}/`)) {
          throw new Error("Forbidden pathname");
        }
        return {
          allowedContentTypes: ["image/png", "image/jpeg", "image/webp"],
          addRandomSuffix: true,
          maximumSizeInBytes: 8 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {
        // No-op. (Does not fire on localhost without a public URL.)
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 400 },
    );
  }
}
