import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getAuthUserId } from '@/lib/auth/auth-session';

// 🛡️ Error response helper
const errorResponse = (message: string, status = 400) => {
  return NextResponse.json({ error: message }, { status });
};

// 📤 POST - Upload avatar
export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Auth check
    const userId = await getAuthUserId();
    if (!userId) return errorResponse('احراز هویت نشده است', 401);

    // 2️⃣ Parse file
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return errorResponse('فایلی انتخاب نشده است');

    // 3️⃣ Validate type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse('فرمت فایل باید JPG، PNG یا WEBP باشد');
    }

    // 4️⃣ Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return errorResponse('حجم فایل نباید بیشتر از 5MB باشد');
    }

    // 5️⃣ Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(join(uploadDir, filename), buffer);
    const imageUrl = `/uploads/avatars/${filename}`;

    console.log('✅ Avatar uploaded:', imageUrl);
    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return errorResponse('خطا در آپلود تصویر', 500);
  }
}
