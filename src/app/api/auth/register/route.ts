import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { checkDuplicates } from '@/lib/utils/check-duplicates';
import { createOTP } from '@/lib/otp/service';
import { sendOTP } from '@/lib/sms/ippanel';
import { registerSchema } from '@/lib/validations/auth.zod';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Validate input data
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'داده نامعتبر' },
        { status: 400 }
      );
    }

    const { phone, email } = parsed.data;

    // 🔍 Check duplicate phone/email
    const dup = await checkDuplicates(phone, email || undefined);
    if (dup.exists) {
      return NextResponse.json({ error: dup.message }, { status: 409 });
    }

    // 🎲 Generate OTP with rate-limiting
    let code: string;
    try {
      code = await createOTP(phone);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'خطا در ایجاد کد' },
        { status: 429 }
      );
    }

    // 📱 Send OTP via SMS
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
