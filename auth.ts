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

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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
