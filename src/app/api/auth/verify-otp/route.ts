import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connection';
import { verifyOTP } from '@/lib/otp/service';
import { User } from '@/lib/db/models/user.model';
import { createAccessToken, createRefreshToken } from '@/lib/auth/auth-jwt';
import { setAccessCookie, setRefreshCookie } from '@/lib/auth/auth-cookies';
import { verifySignupSchema } from '@/lib/validations/auth.zod';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Validate input data
    const body = await req.json().catch(() => null);
    const parsed = verifySignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'داده نامعتبر' },
        { status: 400 }
      );
    }

    const { phone, otp, firstName, lastName, email, password } = parsed.data;

    // 🔐 Verify OTP code
    const verification = await verifyOTP(phone, otp);
    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error, attemptsLeft: verification.attemptsLeft },
        { status: 401 }
      );
    }

    // 🔒 Hash password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // 👑 First user becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    // 💾 Create user account
    let user;
    try {
      user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        email: email?.trim() || undefined,
        password: hashedPassword,
        role,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];
        return NextResponse.json(
         { error: field === 'phone' ? 'این شمارهٔ موبایل قبلاً ثبت شده است.' : 'این ایمیل قبلاً استفاده شده است.' },
         { status: 409 }
        );
      }
      throw err;
    }

    // 🎟️ Generate JWT tokens
    const userId = user._id.toString();
    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken(userId, user.role),
      createRefreshToken(userId),
    ]);

    // 📦 Build response with user
    const response = NextResponse.json(
      {
        success: true,
        message: 'ثبت‌نام انجام شد',
        user: {
          id: userId,
          phone: user.phone,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || null,
        },
      },
      { status: 201 }
    );

    // 🍪 Set auth cookies
    setAccessCookie(response, accessToken);
    setRefreshCookie(response, refreshToken);
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'خطای سرور' },
      { status: 500 }
    );
  }
}
