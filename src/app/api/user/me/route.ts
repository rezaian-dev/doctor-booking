import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/user';

// 🔐 Get authenticated user data
export async function GET() {
  try {
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(payload.userId).select('firstName lastName phone avatar').lean();

    // 🆔 Surface the id (alongside profile fields) so client components can match the
    //    current user against review.userId without a server cookie read on the page. 🧠
    return NextResponse.json({
      user: user ? { id: String(user._id), ...user } : null,
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
