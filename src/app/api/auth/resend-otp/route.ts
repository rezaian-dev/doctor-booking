import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { REGEX } from '@/lib/validations/regex';
import { createOTP } from '@/lib/otp/service';
import { sendOTP } from '@/lib/sms/provider';
import { RateLimitError } from '@/lib/otp/errors';

const resendSchema = z.object({
  phone: z.string().trim().regex(REGEX.PHONE, 'شماره نامعتبر'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = resendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'داده نامعتبر' },
        { status: 400 }
      );
    }

    const { phone } = parsed.data;

    let code: string;
    try {
      code = await createOTP(phone);
    } catch (err) {
      if (err instanceof RateLimitError) {
        return NextResponse.json({ error: err.message }, { status: 429 });
      }
      throw err;
    }

    const sent = await sendOTP(phone, code);
    if (!sent) {
      return NextResponse.json({ error: 'خطا در ارسال کد' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'کد مجدداً ارسال شد' });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'خطای سرور' },
      { status: 500 }
    );
  }
}
