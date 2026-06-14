import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from '@/lib/auth/jwt';
import { setAccessCookie, setRefreshCookie, setSessionHintCookie } from '@/lib/auth/cookies';
import { connectDB } from '@/lib/db/connection';
import { loginPhoneSchema } from '@/lib/validations/auth';
import { User } from '@/lib/db/models/user';
import { checkLoginRateLimit, getClientIp } from '@/lib/auth/login-rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 🛡️ Brute-force guard — throttle per IP BEFORE any DB/bcrypt work
    const rl = await checkLoginRateLimit(getClientIp(req));
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'تلاش‌های ورود بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
      );
    }

    await connectDB();

    const body = await req.json();
    const parsed = loginPhoneSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const user = await User.findOne({ phone: parsed.data.phone }).select('+password');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return NextResponse.json({ error: 'شماره یا رمز نادرست' }, { status: 401 });
    }

    // 🚫 Ban check — after the password is verified
    if (user.isBanned) {
      return NextResponse.json(
        { error: 'حساب کاربری شما مسدود شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.' },
        { status: 403 }
      );
    }

    const [access, refresh] = await Promise.all([
      createAccessToken(user._id.toString(), user.role),
      createRefreshToken(user._id.toString(), user.role),
    ]);

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
    setSessionHintCookie(res); // 🪪 let the header render the avatar immediately, no flash
    return res;
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
