import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client using the service role key. Bypasses RLS; use only in API routes
 * and `lib/*` data helpers. Never import this file from client components.
 */
export function createServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
