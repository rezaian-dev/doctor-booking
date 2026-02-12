import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/db-connect";
import { verifySignupSchema } from "@/lib/validations/validation-auth";
import { verifyOTP } from "@/lib/auth/otp/service";
import { User } from "@/lib/db/models/user.model";
import { createAccessToken, createRefreshToken } from "@/lib/auth/auth-jwt";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/auth-cookies";
import { checkDuplicates } from "@/lib/auth/auth-validation";
import { err, success } from "@/lib/auth/auth-utils";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    //  Validate request
    const body = await req.json();
    const parsed = verifySignupSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.issues[0].message);

    const { firstName, lastName, phone, email, password, otp } = parsed.data;

    // 🔍 Check duplicates
    const duplicate = await checkDuplicates(phone, email);
    if (duplicate.exists) return err(duplicate.message!, 409);

    // ✅ Verify OTP
    const result = await verifyOTP(phone, otp);
    if (!result.success) return err(result.error!, 401);

    // 🔒 Hash password
    const hash = await bcrypt.hash(password, 12);

    // 👑 Determine role
    const count = await User.countDocuments();
    const role = count === 0 ? "admin" : "user";

    // 💾 Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      password: hash,
      role,
      ...(email?.trim() && { email: email.trim() }),
    });

    // 🎟️ Generate tokens
    const [access, refresh] = await Promise.all([
      createAccessToken(user._id.toString(), user.role),
      createRefreshToken(user._id.toString()),
    ]);

    // ✅ Success response
    const res = success(
      {
        message: "ثبت‌نام با موفقیت انجام شد",
        user: {
          id: user._id.toString(),
          phone: user.phone,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      201
    );

    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);

    return res;
  } catch (error: any) {
    console.error("❌ Verification Error:", error);
    if (error.code === 11000) return err("اطلاعات تکراری است", 409);
    return err("خطای سرور. لطفاً بعداً تلاش کنید", 500);
  }
}
