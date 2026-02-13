import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { cookies } from 'next/headers';
import { getAuthUserDoc } from '@/lib/auth/auth-session';

const DIR = join(process.cwd(), 'public', 'uploads', 'avatars');
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// 🗑️ Remove file from disk
async function deleteFile(path?: string) {
  if (!path) return;
  try {
    const full = join(process.cwd(), 'public', path);
    if (existsSync(full)) await unlink(full);
  } catch {}
}

// 📁 Create directory if missing
async function ensureDir() {
  if (!existsSync(DIR)) await mkdir(DIR, { recursive: true });
}

// 📸 Upload avatar image
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const user = await getAuthUserDoc(token || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('avatar') as File | null;

    // ✅ Validate uploaded file
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'فایلی ارسال نشد' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'حجم فایل بیش از ۵MB' }, { status: 400 });
    }
    if (!TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'فقط JPEG, PNG, WebP' }, { status: 400 });
    }

    // 💾 Save to disk
    await ensureDir();
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filepath = join(DIR, filename);
    const url = `/uploads/avatars/${filename}`;

    await writeFile(filepath, buffer);

    // 🗑️ Remove old avatar
    await deleteFile(user.avatar);
    user.avatar = url;
    await user.save();

    return NextResponse.json({ success: true, avatar: url });
  } catch (e) {
    return NextResponse.json({ error: 'آپلود ناموفق' }, { status: 500 });
  }
}

// 🗑️ Delete avatar image
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const user = await getAuthUserDoc(token || '');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 🗑️ Remove file and clear
    await deleteFile(user.avatar);
    user.avatar = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: 'تصویر حذف شد' });
  } catch (e) {
    return NextResponse.json({ error: 'حذف ناموفق' }, { status: 500 });
  }
}
