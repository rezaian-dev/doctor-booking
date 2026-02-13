import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '@/lib/auth/auth-jwt';
import { setAccessCookie, setRefreshCookie } from '@/lib/auth/auth-cookies';
import { connectDB } from '@/lib/db/connection';
import { loginPhoneSchema } from '@/lib/validations/auth.zod';
import { User } from '@/lib/db/models/user.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Validate credentials
    const body = await req.json();
    const parsed = loginPhoneSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    // 🔍 Find user and verify
    const user = await User.findOne({ phone: parsed.data.phone }).select('+password');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return NextResponse.json({ error: 'شماره یا رمز نادرست' }, { status: 401 });
    }

    // 🎟️ Generate JWT tokens
    const [access, refresh] = await Promise.all([
      createAccessToken(user._id.toString(), user.role),
      createRefreshToken(user._id.toString()),
    ]);

    // 🍪 Set cookies and respond
    const res = NextResponse.json({
      message: 'ورود موفق',
      user: {
        id: user._id.toString(),
        phone: user.phone,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);
    return res;
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
