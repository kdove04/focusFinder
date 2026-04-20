import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth-cookie";
import { signSessionToken } from "@/lib/session";
import { findUserByEmail } from "@/lib/users";
import { normalizeEmail, validateEmail } from "@/lib/validate-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    const emailErr = validateEmail(email);
    if (emailErr) {
      return NextResponse.json({ error: emailErr }, { status: 400 });
    }

    const user = await findUserByEmail(normalizeEmail(email));
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await signSessionToken(user.id, user.email);
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    setSessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}
