import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth-cookie";
import { signSessionToken } from "@/lib/session";
import { createUser } from "@/lib/users";
import { validateEmail, validatePassword } from "@/lib/validate-auth";

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
    const passErr = validatePassword(password);
    if (passErr) {
      return NextResponse.json({ error: passErr }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await createUser(email, passwordHash);
    } catch (e) {
      if (e instanceof Error && e.message === "EMAIL_IN_USE") {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      throw e;
    }

    const token = await signSessionToken(user.id, user.email);
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    console.error("[api/auth/register]", e);
    const m = e instanceof Error ? e.message : "";
    if (
      m.includes("SUPABASE") ||
      m.includes("service_role") ||
      m.includes("NEXT_PUBLIC_SUPABASE")
    ) {
      return NextResponse.json({ error: m }, { status: 500 });
    }
    if (
      m.includes("app_users") &&
      (m.includes("does not exist") || m.toLowerCase().includes("schema cache"))
    ) {
      return NextResponse.json(
        {
          error:
            "Database tables are missing. In Supabase, open the SQL editor and run the file supabase/migrations/20260120120000_init.sql from this repo.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" && m ? m : "Could not create account." },
      { status: 500 },
    );
  }
}
