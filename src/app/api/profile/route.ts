import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/db-connect';
import { User } from '@/lib/db/models/user.model';
import { getAuthUserId } from '@/lib/auth/auth-session';

// 🛡️ Helper: Error response
const error = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });

// 📖 GET: Fetch user profile
export async function GET() {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) return error('احراز هویت نشده است', 401);

    const user = await User.findById(userId).select('-password').lean();
    if (!user) return error('کاربر یافت نشد', 404);

    return NextResponse.json({ user });
  } catch (err) {
    console.error('❌ GET:', err);
    return error('خطای سرور', 500);
  }
}

// ✏️ PATCH: Update user profile
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getAuthUserId();
    if (!userId) return error('احراز هویت نشده است', 401);

    const body = await req.json();

    // ✅ Validate required fields
    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.phone?.trim()) {
      return error('نام، نام خانوادگی و شماره موبایل الزامی است');
    }

    // 🔍 Find user
    const user = await User.findById(userId);
    if (!user) return error('کاربر یافت نشد', 404);

    // 🚫 Check duplicates
    if (body.email?.trim() && body.email !== user.email) {
      const exists = await User.findOne({ email: body.email, _id: { $ne: userId } });
      if (exists) return error('این ایمیل قبلاً ثبت شده است', 409);
    }

    if (body.phone !== user.phone) {
      const exists = await User.findOne({ phone: body.phone, _id: { $ne: userId } });
      if (exists) return error('این شماره قبلاً ثبت شده است', 409);
    }

    // 🔨 Build update query
    const $set: Record<string, any> = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
    };
    const $unset: Record<string, 1> = {};

    // 📋 Handle optional fields (add if value, remove if empty)
    const fields = [
      ['email', body.email?.trim()],
      ['nationalCode', body.nationalCode?.trim()],
      ['birthDate', body.birthDate],
      ['gender', body.gender],
      ['city', body.city?.trim()],
      ['avatar', body.avatar],
    ];

    fields.forEach(([key, val]) => {
      val ? ($set[key] = val) : ($unset[key] = 1);
    });

    // 🔐 Hash password if provided
    if (body.password?.trim()) {
      $set.password = await bcrypt.hash(body.password.trim(), 10);
    }

    // 💾 Update
    const query: any = { $set };
    if (Object.keys($unset).length) query.$unset = $unset;

    const updated = await User.findByIdAndUpdate(userId, query, {
      new: true,
      runValidators: true
    }).select('-password').lean();

    if (!updated) return error('خطا در بروزرسانی', 500);

    return NextResponse.json({
      success: true,
      message: 'اطلاعات بروزرسانی شد',
      user: updated,
    });

  } catch (err: any) {
    console.error('❌ PATCH:', err);

    // 🛡️ Handle validation errors
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map((e: any) => e.message).join(', ');
      return error(msg || 'داده‌های ورودی نامعتبر است');
    }

    return error('خطای سرور', 500);
  }
}
