import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { checkDuplicates } from '@/lib/utils/check-duplicates';
import { createOTP } from '@/lib/otp/service';
import { sendOTP } from '@/lib/sms/provider';
import { registerSchema } from '@/lib/validations/auth';
import { User } from '@/lib/db/models/user';
import { RateLimitError } from '@/lib/otp/errors';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'داده نامعتبر' },
        { status: 400 }
      );
    }

    const { phone, email } = parsed.data;

    // Ban check — before checkDuplicates
    const bannedUser = await User.findOne({
      isBanned: true,
      $or: [{ phone }, ...(email ? [{ email }] : [])],
    }).select('_id').lean();

    if (bannedUser) {
      return NextResponse.json(
        { error: 'این شماره یا ایمیل مسدود شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.' },
        { status: 403 }
      );
    }

    // Duplicate check
    const dup = await checkDuplicates(phone, email || undefined);
    if (dup.exists) {
      return NextResponse.json({ error: dup.message }, { status: 409 });
    }

    let code: string;
    try {
      code = await createOTP(phone);
    } catch (err) {
      // Only RateLimitError returns 429 — all other errors (Redis infra) bubble to 500
      if (err instanceof RateLimitError) {
        return NextResponse.json({ error: err.message }, { status: 429 });
      }
      throw err;
    }

    const sent = await sendOTP(phone, code);
    if (!sent) {
      return NextResponse.json({ error: 'خطا در ارسال کد' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'کد ارسال شد' });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'خطای سرور' },
      { status: 500 }
    );
  }
}
