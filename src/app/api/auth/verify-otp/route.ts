import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/db-connect";
import { verifyOTP } from "@/lib/auth/auth-otp";
import { User } from "@/lib/db/models/user.model";
import { createAccessToken, createRefreshToken } from "@/lib/auth/auth-jwt";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/auth-cookies";

// 🛡️ Error helper
const err = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });

// 🔐 Verify OTP & create user
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { firstName, lastName, phone, email, password, otp } = await req.json();

    // ✅ Validate required fields
    if (!firstName || !lastName || !phone || !password || !otp) {
      return err("تمام فیلدهای الزامی را پر کنید");
    }

    // ✅ Verify OTP first
    if (!verifyOTP(phone, otp)) {
      return err("کد تایید نادرست یا منقضی شده است");
    }

    // 🔍 Double-check for race condition
    const query: any = { phone };
    if (email?.trim()) query.$or = [{ phone }, { email: email.trim() }];

    const exists = await User.findOne(query);
    if (exists) {
      return err("این شماره یا ایمیل قبلاً ثبت شده است", 409);
    }

    // 🔒 Hash password
    const hash = await bcrypt.hash(password, 12);

    // 👑 First user = admin
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

    // 🍪 Set cookies
    const res = NextResponse.json(
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
      { status: 201 }
    );

    setAccessCookie(res, access);
    setRefreshCookie(res, refresh);

    return res;

  } catch (error: any) {
    console.error("❌ Verify error:", error);

    // 🔍 Handle duplicate key error
    if (error.code === 11000) {
      return err("این شماره یا ایمیل قبلاً ثبت شده است", 409);
    }

    return err("خطای سرور", 500);
  }
}
