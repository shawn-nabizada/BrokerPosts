import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readProfile, writeProfile } from "@/lib/blob";
import { EMPTY_BROKER, type Broker } from "@/types";

export const runtime = "nodejs";

// GET /api/profile — the signed-in user's profile, or null.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const profile = await readProfile(session.user.id);
  return NextResponse.json({ profile });
}

// POST /api/profile — upsert the signed-in user's profile.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Partial<Broker>;
  try {
    body = (await req.json()) as Partial<Broker>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const broker: Broker = { ...EMPTY_BROKER, ...body };

  // Boundary validation — required fields.
  if (!broker.name?.trim() || !broker.email?.trim() || !broker.phone?.trim()) {
    return NextResponse.json(
      { error: "name, email and phone are required" },
      { status: 422 },
    );
  }

  try {
    await writeProfile(session.user.id, broker);
  } catch (e) {
    console.error("Profile save failed", e);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ profile: broker });
}
