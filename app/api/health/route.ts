import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Liveness and DB connectivity check. Does not expose secrets.
 * Use for Render/ops; returns 200 when Supabase is reachable and `app_users` is queryable.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    return NextResponse.json({ ok: false, reason: "supabase_env_missing" }, { status: 503 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("app_users").select("id", { count: "exact", head: true });
    if (error) {
      return NextResponse.json(
        {
          ok: false,
          reason: "supabase_query_failed",
          ...(process.env.NODE_ENV === "development" ? { message: error.message } : {}),
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: true, supabase: "ok" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      {
        ok: false,
        reason: "supabase_unavailable",
        ...(process.env.NODE_ENV === "development" ? { message } : {}),
      },
      { status: 503 },
    );
  }
}
