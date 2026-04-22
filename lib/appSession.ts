import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export type AppSession = { userId: string; email: string };

/** Session for the current request (App Router / server). */
export async function getAppSession(): Promise<AppSession | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
