import { NextResponse } from "next/server";
import { getAppSession } from "@/lib/appSession";
import { defaultUserStudyPreferences, getUserPreferences, upsertUserPreferences } from "@/lib/userPreferences";
import type { UserStudyPreferences } from "@/lib/userPreferences";

export const dynamic = "force-dynamic";

function parseBody(
  input: unknown,
):
  | { ok: true; value: { preferredNoise: UserStudyPreferences["preferredNoise"]; preferredBusyness: UserStudyPreferences["preferredBusyness"]; studyStyle: UserStudyPreferences["studyStyle"] } }
  | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid JSON body." };
  }
  const o = input as Record<string, unknown>;
  const n = o.preferredNoise;
  const b = o.preferredBusyness;
  const s = o.studyStyle;
  if (n !== "quiet" && n !== "moderate" && n !== "loud") {
    return { ok: false, error: "preferredNoise must be quiet, moderate, or loud." };
  }
  if (b !== "low" && b !== "medium" && b !== "high") {
    return { ok: false, error: "preferredBusyness must be low, medium, or high." };
  }
  if (s !== "solo" && s !== "group" && s !== "either") {
    return { ok: false, error: "studyStyle must be solo, group, or either." };
  }
  return { ok: true, value: { preferredNoise: n, preferredBusyness: b, studyStyle: s } };
}

export async function GET() {
  const session = await getAppSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const stored = await getUserPreferences(session.userId);
    const preferences = stored ?? defaultUserStudyPreferences(session.userId);
    return NextResponse.json({ preferences });
  } catch (e) {
    console.error("[api/user/preferences GET]", e);
    return NextResponse.json({ error: "Could not load preferences." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAppSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = parseBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const preferences = await upsertUserPreferences(session.userId, parsed.value);
    return NextResponse.json({ preferences });
  } catch (e) {
    console.error("[api/user/preferences PUT]", e);
    return NextResponse.json({ error: "Could not save preferences." }, { status: 500 });
  }
}
