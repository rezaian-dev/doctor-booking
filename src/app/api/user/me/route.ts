import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/auth-jwt';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/db/models/user.model';

// 🔐 Get authenticated user data
export async function GET() {
  try {
    const token = (await cookies()).get('accessToken')?.value;
    if (!token) return NextResponse.json({ user: null });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(payload.userId).select('firstName lastName phone avatar').lean();

    return NextResponse.json({ user: user || null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
