import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db-connect";
import { signupSchema } from "@/lib/validations/validation-auth";
import { canRequestOTP, generateOTP, storeOTP } from "@/lib/auth/auth-otp";
import { User } from "@/lib/db/models/user.model";
import { sendOTP } from "@/lib/sms/sms-ippanel";

// 🛡️ Error helper
const err = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });

// 📝 Send OTP
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Validate input
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return err(parsed.error.issues[0].message);
    }

    const { phone, email } = parsed.data;

    // 🚦 Rate limit check
    const limit = canRequestOTP(phone);
    if (!limit.allowed) {
      return err(`لطفاً ${limit.waitTime} ثانیه صبر کنید`, 429);
    }

    // 🔍 Check duplicate user
    const query: any = { phone };
    if (email?.trim()) query.$or = [{ phone }, { email: email.trim() }];

    const exists = await User.findOne(query);
    if (exists) {
      return err("این شماره یا ایمیل قبلاً ثبت شده است", 409);
    }

    // 🎲 Generate & store OTP
    const otp = generateOTP();
    storeOTP(phone, otp);

    // 📨 Send SMS
    const sent = await sendOTP(phone, otp);
    if (!sent) {
      return err("خطا در ارسال پیامک", 500);
    }

    return NextResponse.json({
      message: "کد تایید ارسال شد",
      expiresIn: 300 // 5 minutes
    });

  } catch (error) {
    console.error("❌ Register OTP error:", error);
    return err("خطای سرور", 500);
  }
}
