import { jwtVerify } from "jose/jwt/verify";
import { getJwtSecretKeyBytes } from "./jwt-key";

/**
 * Edge-safe session verify (imports `jose/jwt/verify` only, not the full jose entry).
 */
export async function verifySessionTokenEdge(
  token: string,
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKeyBytes());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") return null;
    return { userId: sub, email };
  } catch {
    return null;
  }
}
