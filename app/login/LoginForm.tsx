"use client";

import { signIn } from "next-auth/react";

const errorMessages: Record<string, string> = {
  AccessDenied:
    "Only Jackson State student accounts can sign in. Use your JNumber@students.jsums.edu Microsoft 365 login.",
  Configuration: "Sign-in is not configured. Check server environment variables.",
  Default: "Sign-in failed. Try again or contact IT if the problem continues.",
};

type Props = {
  callbackUrl?: string;
  error?: string;
};

function safeCallbackUrl(url: string | undefined): string {
  if (url && url.startsWith("/") && !url.startsWith("//")) return url;
  return "/locations";
}

export function LoginForm({ callbackUrl, error }: Props) {
  const message = error ? errorMessages[error] ?? errorMessages.Default : null;
  const target = safeCallbackUrl(callbackUrl);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-jsu-navy/10 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-jsu-navy">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Use your <strong className="text-jsu-navy">JSU Microsoft 365</strong> account—the same
        credentials you use for student email (<span className="whitespace-nowrap">JNumber</span>
        @students.jsums.edu).
      </p>
      {message && (
        <p
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          role="alert"
        >
          {message}
        </p>
      )}
      <button
        type="button"
        onClick={() => void signIn("microsoft-entra-id", { callbackUrl: target })}
        className="mt-6 w-full rounded-xl bg-jsu-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-jsu-blue"
      >
        Continue with Microsoft
      </button>
      <p className="mt-4 text-center text-xs text-muted">
        By signing in you agree to use this app only as permitted by university policy.
      </p>
    </div>
  );
}
