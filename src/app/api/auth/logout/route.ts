import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

// 🚪 Logout and clear cookies
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    clearAuthCookies(response);
    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
