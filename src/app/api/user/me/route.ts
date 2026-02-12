import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/auth-jwt';
import { connectDB } from '@/lib/db/db-connect';
import { User } from '@/lib/db/models/user.model';

// 🔐 GET /api/user/me - Fetch authenticated user data
export async function GET(req: NextRequest) {
  try {
    // 🍪 Extract and verify token
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ user: null });

    // 🗄️ Fetch user from database
    await connectDB();
    const user = await User.findById(payload.userId)
      .select('firstName lastName avatar')
      .lean();

    if (!user) return NextResponse.json({ user: null });

    // 📦 Return sanitized user data
    return NextResponse.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
    });
  } catch {
    // 🛡️ Fail gracefully on any error
    return NextResponse.json({ user: null });
  }
}
