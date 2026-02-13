import { NextResponse } from 'next/server';

const IS_PROD = process.env.NODE_ENV === 'production';

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
};
