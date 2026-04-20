"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function safeRedirectPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/home";
  return next;
}

type Mode = "signin" | "register";

export function AuthLanding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeRedirectPath(searchParams.get("next"));

  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const path = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(nextPath);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-10">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-jsu-navy">Welcome to Focus Finder</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Create an account or sign in to browse study spots, noise checks, and feedback—your session
          stays signed in on this device.
        </p>
      </div>

      <div className="rounded-2xl border border-jsu-navy/10 bg-white p-6 shadow-sm sm:p-8">
        <div
          className="mb-6 flex rounded-xl border border-jsu-navy/10 bg-jsu-cream/40 p-1"
          role="tablist"
          aria-label="Account"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-white text-jsu-navy shadow-sm"
                : "text-muted hover:text-jsu-navy"
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
              mode === "signin"
                ? "bg-white text-jsu-navy shadow-sm"
                : "text-muted hover:text-jsu-navy"
            }`}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="auth-email" className="block text-sm font-medium text-jsu-navy">
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-jsu-navy/15 px-4 py-2.5 text-jsu-navy outline-none ring-jsu-gold/50 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="block text-sm font-medium text-jsu-navy">
              Password
            </label>
            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-jsu-navy/15 px-4 py-2.5 text-jsu-navy outline-none ring-jsu-gold/50 focus:ring-2"
            />
            {mode === "register" && (
              <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
            )}
          </div>
          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-jsu-navy py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-jsu-blue disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "register" ? "Create account & continue" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
