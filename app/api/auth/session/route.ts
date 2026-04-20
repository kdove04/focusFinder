import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: { id: session.userId, email: session.email },
  });
}
