import { SignJWT, jwtVerify } from 'jose';

// 🔑 Encode secrets once at startup for performance & security
const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET!);

/**
 * 🪪 Issues a short-lived access token (15m) containing user identity and role.
 * Used for authenticating API requests.
 */
export async function createAccessToken(userId: string, role: string): Promise<string> {
  return new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(ACCESS_SECRET);
}

/**
 * ♻️ Issues a long-lived refresh token (7d) containing only the user ID.
 * Used to obtain new access tokens without re-authentication.
 */
export async function createRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(REFRESH_SECRET);
}

/**
 * 🔍 Verifies an access token and returns its payload if valid.
 * Returns `null` if expired, malformed, or tampered.
 */
export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload;
  } catch {
    return null;
  }
}

/**
 * 🔄 Verifies a refresh token and returns its payload if valid.
 * Returns `null` if expired, invalid, or signature mismatch.
 */
export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload;
  } catch {
    return null;
  }
}
