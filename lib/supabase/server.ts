import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function parseJwtRole(key: string): string | null {
  const parts = key.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const padded = b64 + (pad ? "=".repeat(4 - pad) : "");
    const json = Buffer.from(padded, "base64").toString("utf8");
    const payload = JSON.parse(json) as { role?: string };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

/**
 * Server-only client using the service role key. Bypasses RLS; use only in API routes
 * and `lib/*` data helpers. Never import this file from client components.
 */
export function createServiceRoleClient(): SupabaseClient {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!url || !key) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (Project Settings → API in Supabase). The anon public key is not enough for server writes.",
    );
  }
  const role = parseJwtRole(key);
  if (role && role !== "service_role") {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY must be the service_role key (current JWT role: "${role}"). In Supabase: Project Settings → API → "service_role" secret.`,
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
