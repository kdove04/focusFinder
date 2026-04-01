import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const PROFILE_PHOTO_SIZE = 48;
/** Extra time for Duo / Conditional Access so OAuth state cookies do not expire mid-flow */
const OAUTH_COOKIE_MAX_AGE_SEC = 60 * 30;

function parseAllowedDomains(): string[] {
  const raw = process.env.ALLOWED_EMAIL_DOMAINS?.trim();
  if (raw) {
    return raw.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);
  }
  return ["students.jsums.edu"];
}

/**
 * Microsoft often omits `email` on ID tokens for managed tenants until optional claims
 * are configured; `preferred_username` / `upn` still carry the JNumber@students.jsums.edu UPN.
 */
function resolveMicrosoftSignInIdentity(profile: unknown): string | undefined {
  if (!profile || typeof profile !== "object") return undefined;
  const p = profile as Record<string, unknown>;
  const keys = ["email", "preferred_username", "upn", "unique_name"] as const;
  for (const key of keys) {
    const v = p[key];
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return undefined;
}

function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = email.toLowerCase();
  const domains = parseAllowedDomains();
  return domains.some((d) => e.endsWith(`@${d}`));
}

function resolveAuthSecret(): string | undefined {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") return undefined;
  return "focus-finder-dev-only-not-for-production";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: resolveAuthSecret(),
  cookies: {
    pkceCodeVerifier: {
      options: {
        maxAge: OAUTH_COOKIE_MAX_AGE_SEC,
      },
    },
    state: {
      options: {
        maxAge: OAUTH_COOKIE_MAX_AGE_SEC,
      },
    },
    nonce: {
      options: {
        maxAge: OAUTH_COOKIE_MAX_AGE_SEC,
      },
    },
  },
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
      profilePhotoSize: PROFILE_PHOTO_SIZE,
      async profile(profile, tokens) {
        let image: string | null = null;
        try {
          const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/photos/${PROFILE_PHOTO_SIZE}x${PROFILE_PHOTO_SIZE}/$value`,
            { headers: { Authorization: `Bearer ${tokens.access_token}` } },
          );
          if (response.ok && typeof Buffer !== "undefined") {
            try {
              const pictureBuffer = await response.arrayBuffer();
              const pictureBase64 = Buffer.from(pictureBuffer).toString("base64");
              image = `data:image/jpeg;base64, ${pictureBase64}`;
            } catch {
              /* ignore photo decode errors */
            }
          }
        } catch {
          /* Graph / network errors must not block sign-in */
        }

        return {
          id: profile.sub,
          name: profile.name ?? null,
          email: resolveMicrosoftSignInIdentity(profile) ?? null,
          image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      const id = resolveMicrosoftSignInIdentity(profile);
      return isAllowedEmail(id);
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const id = resolveMicrosoftSignInIdentity(profile);
        if (id) token.email = id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.email === "string" && token.email) {
        session.user.email = token.email;
      }
      return session;
    },
  },
});
