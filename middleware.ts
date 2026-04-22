import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { verifySessionTokenEdge } from "@/lib/session-middleware";

async function getSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionTokenEdge(token);
}

function isProtectedPath(pathname: string): boolean {
  const protectedPrefixes = ["/home", "/locations", "/noise", "/contribute"];
  return protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/health" ||
    pathname.includes(".") // static files like favicon.ico
  ) {
    return NextResponse.next();
  }

  const session = await getSession(request);

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (isProtectedPath(pathname) && !session) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all pathnames except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
