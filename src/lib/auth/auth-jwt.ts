import { SignJWT, jwtVerify } from "jose";

// 🔑 Secret keys from environment variables
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET);

// ⏱️ Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes ⚡
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days 🔄

// 🎯 Token payload interface
export interface TokenPayload {
  userId: string;
  role?: string;
}

/**
 * ✅ Create Access Token
 */
export async function createAccessToken(userId: string, role?: string): Promise<string> {
  return await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}

/**
 * ✅ Create Refresh Token
 */
export async function createRefreshToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_TOKEN_SECRET);
}

/**
 * 🔍 Verify Access Token
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as string | undefined,
    };
  } catch (error) {
    return null;
  }
}

/**
 * 🔍 Verify Refresh Token
 */
export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return {
      userId: payload.userId as string,
    };
  } catch (error) {
    return null;
  }
}

/**
 * ✅ Generate Access Token (alternative name for consistency)
 */
export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return await createAccessToken(payload.userId, payload.role);
}

/**
 * ✅ Generate Refresh Token (alternative name for consistency)
 */
export async function generateRefreshToken(payload: TokenPayload): Promise<string> {
  return await createRefreshToken(payload.userId);
}
