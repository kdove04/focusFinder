/** Shared HMAC secret for session JWTs (Node + Edge). */
export function getJwtSecretKeyBytes(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 16) {
    return new TextEncoder().encode(s);
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "AUTH_SECRET is not set (or too short). Set a strong secret in production.",
    );
  }
  return new TextEncoder().encode("dev-only-focusfinder-change-me");
}
