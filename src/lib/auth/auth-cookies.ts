import { NextResponse } from "next/server";

/**
 * 🍪 Set Access Token Cookie
 */
export function setAccessCookie(response: NextResponse, token: string): void {
  response.cookies.set("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes ⏱️
    path: "/",
  });
}

/**
 * 🍪 Set Refresh Token Cookie
 */
export function setRefreshCookie(response: NextResponse, token: string): void {
  response.cookies.set("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days 🔄
    path: "/",
  });
}

/**
 * 🧹 Clear Authentication Cookies
 */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
}
