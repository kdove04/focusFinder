import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

function parseAllowedDomains(): string[] {
  const raw = process.env.ALLOWED_EMAIL_DOMAINS?.trim();
  if (raw) {
    return raw.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);
  }
  return ["students.jsums.edu"];
}

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  const domains = parseAllowedDomains();
  return domains.some((d) => e.endsWith(`@${d}`));
}

/**
 * Auth.js requires a secret to sign cookies/JWTs. Without it, every `auth()` call throws
 * (runtime error on all pages). Production must set AUTH_SECRET; local dev uses a fixed
 * fallback so the app runs before `.env.local` is filled in.
 */
function resolveAuthSecret(): string | undefined {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") return undefined;
  return "focus-finder-dev-only-not-for-production";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: resolveAuthSecret(),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const email = typeof profile?.email === "string" ? profile.email : undefined;
      return isAllowedEmail(email);
    },
  },
});
