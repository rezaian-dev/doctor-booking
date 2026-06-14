import { NextResponse } from 'next/server';
import { SESSION_HINT_COOKIE } from '@/lib/auth/session-hint';

const IS_PROD = process.env.NODE_ENV === 'production';

// 🪪 Non-httpOnly "session present" hint — readable by the client header to render login-vs-
//    skeleton with zero flash. Carries no identity; lifetime mirrors the refresh token. 👁️
export const setSessionHintCookie = (res: NextResponse) => {
  res.cookies.set(SESSION_HINT_COOKIE, '1', {
    httpOnly: false, // 👁️ MUST be readable by JS — that's the whole point
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days (≈ refresh-token lifetime)
    path: '/',
  });
};

// 🗑️ Drop the hint (logout / self-heal on invalid session)
export const clearSessionHintCookie = (res: NextResponse) => {
  res.cookies.delete(SESSION_HINT_COOKIE);
};

// 🍪 Set access token cookie
export const setAccessCookie = (res: NextResponse, token: string) => {
  res.cookies.set('accessToken', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/',
  });
};

// 🍪 Set refresh token cookie
export const setRefreshCookie = (res: NextResponse, token: string) => {
  res.cookies.set('refreshToken', token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
};

// 🗑️ Clear auth cookies
export const clearAuthCookies = (res: NextResponse) => {
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');
  res.cookies.delete(SESSION_HINT_COOKIE); // 🪪 keep the client hint in sync
};
