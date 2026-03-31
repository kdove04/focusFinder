import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }
  if (path === "/" || path.startsWith("/login")) {
    return NextResponse.next();
  }
  if (!req.auth) {
    const login = new URL("/login", req.nextUrl.origin);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
