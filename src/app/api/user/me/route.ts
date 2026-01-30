// app/api/user/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/auth-jwt';
import { connectDB } from '@/lib/db/db-connect';
import { User } from '@/lib/db/models/user.model';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(payload.userId).select('firstName lastName avatar');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
  });
}
