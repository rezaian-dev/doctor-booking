import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/auth-cookies';

// 🚪 POST /api/auth/logout - Clear authentication cookies
export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
