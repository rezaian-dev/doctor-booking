// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRefreshToken, createAccessToken } from "@/lib/auth/auth-jwt";
import { connectDB } from "@/lib/db/db-connect";
import { User } from "@/lib/db/models/user.model";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🔄 Auto-refresh for all requests
  if (!accessToken && refreshToken) {
    const payload = await verifyRefreshToken(refreshToken);

    if (payload) {
      try {
        await connectDB();
        const user = await User.findById(payload.userId);

        if (user) {
          const newAccessToken = await createAccessToken(user._id.toString());
          const response = NextResponse.next();

          response.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
          });

          return response;
        }
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
    }
  }

  // 🔒 Protected routes
  if (pathname.startsWith("/profile")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 🏠 Auth pages redirect
  if (pathname.startsWith("/auth/") && refreshToken) {
    const payload = await verifyRefreshToken(refreshToken);
    if (payload) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
