import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/db-connect";
import { signupSchema } from "@/lib/validations/validation-auth";
import { canRequestOTP, createOTP } from "@/lib/auth/otp/service";
import { sendOTP } from "@/lib/sms/sms-ippanel";
import { checkDuplicates } from "@/lib/auth/auth-validation";
import { err, success, formatWaitTime } from "@/lib/auth/auth-utils";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // 📥 Validate request
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { phone, email } = parsed.data;

    // 🔍 Check duplicates
    const duplicate = await checkDuplicates(phone, email);
    if (duplicate.exists) return err(duplicate.message!, 409);

    // 🚦 Check rate limit
    const rateCheck = await canRequestOTP(phone);
    if (!rateCheck.allowed) {
      const waitTime = formatWaitTime(rateCheck.waitTime!);
      const message =
        rateCheck.reason === "throttle"
          ? `لطفاً ${waitTime} صبر کنید`
          : `تعداد درخواست‌ها بیش از حد مجاز است. لطفاً ${waitTime} صبر کنید`;
      return err(message, 429);
    }

    // 📨 Send OTP
    const code = await createOTP(phone);
    const sent = await sendOTP(phone, code);
    if (!sent) return err("خطا در ارسال پیامک. لطفاً دوباره تلاش کنید", 500);

    // ✅ Success
    return success({
      message: "کد تایید با موفقیت ارسال شد",
      expiresIn: 300,
      ...(rateCheck.remaining !== undefined && {
        remainingAttempts: rateCheck.remaining,
      }),
    });
  } catch (error) {
    console.error("❌ OTP Request Error:", error);
    return err("خطای سرور. لطفاً بعداً تلاش کنید", 500);
  }
}
