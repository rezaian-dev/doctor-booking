import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "@/lib/auth/auth-jwt";
import { setAccessCookie, setRefreshCookie } from "@/lib/auth/auth-cookies";
import { connectDB } from "@/lib/db/db-connect";
import { loginPhoneSchema } from "@/lib/validations/validation-auth";
import { User } from "@/lib/db/models/user.model";

// 🔐 POST - Login with phone and password
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Validate request body
    const body = await req.json();
    const { error, data } = loginPhoneSchema.safeParse(body);
    if (error) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }

    // 🔍 Find user and verify password
    const user = await User.findOne({ phone: data.phone }).select("+password");
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return NextResponse.json({ error: "شماره یا رمز عبور نادرست است" }, { status: 401 });
    }

    // 🎟️ Generate tokens
    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken(user._id.toString(), user.role),
      createRefreshToken(user._id.toString()),
    ]);

    // 🍪 Set cookies and return response
    const response = NextResponse.json({
      message: "ورود موفق",
      user: {
        id: user._id.toString(),
        phone: user.phone,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    setAccessCookie(response, accessToken);
    setRefreshCookie(response, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
