import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import { getAuthUserDoc } from '@/lib/auth/auth-session';
import { checkDuplicatesForUpdate } from '@/lib/utils/check-duplicates';

const ALLOWED = ['firstName', 'lastName', 'email', 'phone', 'nationalCode', 'birthDate', 'gender', 'city'] as const;

// 📄 Fetch user profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const user = await getAuthUserDoc(token || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password, ...data } = user.toObject();
    return NextResponse.json({ success: true, user: data });
  } catch (e) {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}

// ✏️ Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const user = await getAuthUserDoc(token || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 🔍 Check for duplicate phone/email
    const phoneChanged = body.phone && body.phone !== user.phone;
    const emailChanged = body.email && body.email !== user.email;

    if (phoneChanged || emailChanged) {
      const dup = await checkDuplicatesForUpdate(
        user._id.toString(),
        phoneChanged ? body.phone : undefined,
        emailChanged ? body.email : undefined
      );
      if (dup.exists) {
        return NextResponse.json(
          { error: dup.message, field: dup.field },
          { status: 409 }
        );
      }
    }

    // 📝 Build update object
    const updates: Record<string, any> = {};
    ALLOWED.forEach(f => {
      if (f in body) updates[f] = body[f] || undefined;
    });
    if (body.password?.trim()) {
      updates.password = await hash(body.password.trim(), 12);
    }

    // 💾 Save changes
    Object.assign(user, updates);
    await user.save();

    const { password, ...data } = user.toObject();
    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    // 🚫 Duplicate key error
    if (error.code === 11000) {
      const field = error.keyPattern?.email ? 'email' : 'phone';
      return NextResponse.json(
        {error: field === 'email' ? 'این ایمیل قبلاً ثبت شده است.' : 'این شمارهٔ موبایل قبلاً ثبت شده است.',field },
        { status: 409 }
      );
    }

    // ❌ Validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: 'داده نامعتبر' }, { status: 400 });
    }

    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
