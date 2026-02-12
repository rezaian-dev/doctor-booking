import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import getAuthenticatedUser from '@/lib/auth/auth-session';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'avatars');

// 🗑️ Safe file deletion helper
async function safeDeleteFile(avatarPath?: string): Promise<void> {
  if (!avatarPath) return;

  try {
    const fullPath = join(process.cwd(), 'public', avatarPath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      console.log('✅ Deleted old avatar:', avatarPath);
    }
  } catch (error) {
    console.warn('⚠️ Failed to delete avatar:', error);
  }
}

// 📁 Ensure upload directory exists
async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
    console.log('✅ Created upload directory:', UPLOAD_DIR);
  }
}

// 📸 POST /api/profile/upload-avatar - Upload avatar
export async function POST(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    const user = await getAuthenticatedUser(req);

    if (!user) {
      console.warn('🔐 Unauthorized access attempt to POST /api/profile/upload-avatar');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Session expired. Please login again' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user for avatar upload:', user._id);

    const formData = await req.formData();
    const avatarFile = formData.get('avatar') as File | null;

    if (!avatarFile || avatarFile.size === 0) {
      console.warn('⚠️ No file provided in upload request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // ✅ Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > MAX_SIZE) {
      console.warn('⚠️ File too large:', avatarFile.size);
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // ✅ Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      console.warn('⚠️ Invalid file type:', avatarFile.type);
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    console.log('📁 Uploading file:', {
      name: avatarFile.name,
      type: avatarFile.type,
      size: avatarFile.size
    });

    // 📁 Prepare upload directory
    await ensureUploadDir();

    // 💾 Save new avatar
    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const filename = `${Date.now()}-${avatarFile.name.replace(/\s+/g, '-')}`;
    const filepath = join(UPLOAD_DIR, filename);
    const avatarUrl = `/uploads/avatars/${filename}`;

    await writeFile(filepath, buffer);
    console.log('✅ Avatar saved:', avatarUrl);

    // 🗑️ Delete old avatar after successful upload
    const oldAvatar = user.avatar;
    await safeDeleteFile(oldAvatar);

    // ✅ Update database
    user.avatar = avatarUrl;
    await user.save();

    console.log('✅ Avatar updated in database for user:', user._id);

    return NextResponse.json({
      success: true,
      avatar: avatarUrl
    });
  } catch (error: any) {
    console.error('❌ Avatar upload error:', error);

    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE /api/profile/upload-avatar - Delete avatar
export async function DELETE(req: NextRequest) {
  try {
    // 🔐 Authenticate user
    const user = await getAuthenticatedUser(req);

    if (!user) {
      console.warn('🔐 Unauthorized access attempt to DELETE /api/profile/upload-avatar');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Session expired. Please login again' },
        { status: 401 }
      );
    }

    console.log('✅ Authenticated user for avatar deletion:', user._id);

    // 🗑️ Delete file and clear database reference
    await safeDeleteFile(user.avatar);
    user.avatar = undefined;
    await user.save();

    console.log('✅ Avatar deleted for user:', user._id);

    return NextResponse.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('❌ Avatar deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
}
