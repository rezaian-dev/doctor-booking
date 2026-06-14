import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connection';
import { verifyOTP } from '@/lib/otp/service';
import { User } from '@/lib/db/models/user';
import { createAccessToken, createRefreshToken } from '@/lib/auth/jwt';
import { setAccessCookie, setRefreshCookie, setSessionHintCookie } from '@/lib/auth/cookies';
import { verifySignupSchema } from '@/lib/validations/auth';

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
      // 🪵 Dev-only exact reason so a 401 is never a mystery: "نامعتبر/منقضی" = no active code
      //    (old/overwritten/timed-out), "نادرست" = a different code is stored (stale or typo).
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[verify-otp] ❌ otp="${otp}" → ${verification.error}` +
            (verification.attemptsLeft != null ? ` | attemptsLeft=${verification.attemptsLeft}` : '') +
            (verification.requireResend ? ' | requireResend' : '')
        );
      }
      return NextResponse.json(
        {
          error: verification.error,
          attemptsLeft: verification.attemptsLeft,
          requireResend: verification.requireResend,
        },
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
        password: hashedPassword,
        role,
        // 🧠 Omit email entirely when absent — passing `undefined` breaks the
        //    create() overload under exactOptionalPropertyTypes (→ user: never).
        ...(email?.trim() ? { email: email.trim() } : {}),
      });
    } catch (err: unknown) {
      // 🔑 MongoDB duplicate key error shape: { code: 11000, keyPattern: { field: 1 } }
      const mongoErr = err as { code?: number; keyPattern?: Record<string, unknown> };
      if (mongoErr.code === 11000) {
        const field = Object.keys(mongoErr.keyPattern || {})[0];
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
      createRefreshToken(userId, user.role),
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
    setSessionHintCookie(response); // 🪪 header shows the avatar instantly after signup
    return response;
  } catch (err) {
    // 🧪 Surface Mongoose validation issues as actionable 400s, not opaque 500s
    const e = err as { name?: string; message?: string };
    if (e?.name === 'ValidationError') {
      return NextResponse.json({ error: 'اطلاعات ثبت‌نام ناقص یا نامعتبر است.' }, { status: 400 });
    }
    // 🔊 Log the real cause so the terminal shows it instead of swallowing it
    console.error('[verify-otp] error →', e?.message || err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'خطای سرور' },
      { status: 500 }
    );
  }
}
