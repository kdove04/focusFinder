"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const nav = [
  { href: "/locations", label: "Study spots" },
  { href: "/noise", label: "Noise check" },
  { href: "/contribute", label: "Share feedback" },
];

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-jsu-navy/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-jsu-navy text-sm font-bold text-jsu-gold shadow-sm transition group-hover:bg-jsu-blue"
            aria-hidden
          >
            FF
          </span>
          <div className="leading-tight">
            <span className="block font-semibold text-jsu-navy">Focus Finder</span>
            <span className="text-xs text-muted">Jackson State University</span>
          </div>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {session && (
            <nav className="flex flex-wrap gap-1 sm:gap-2" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-jsu-navy/80 transition hover:bg-jsu-cream hover:text-jsu-navy"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2 border-l border-jsu-navy/10 pl-2 sm:pl-3">
            {status === "loading" ? (
              <span className="text-xs text-muted">…</span>
            ) : session?.user ? (
              <>
                <span className="hidden max-w-[140px] truncate text-xs text-muted sm:inline">
                  {session.user.email}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut({ callbackUrl: "/" })}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-jsu-navy/80 transition hover:bg-jsu-cream hover:text-jsu-navy"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-jsu-navy px-3 py-2 text-sm font-semibold text-white transition hover:bg-jsu-blue"
              >
                Sign in with JSU
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
