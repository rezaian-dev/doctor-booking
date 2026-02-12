import { User } from '@/lib/db/models/user.model';

interface DuplicateCheckResult {
  exists: boolean;
  field?: 'phone' | 'email';
  message?: string;
}

// 🆕 For registration (no user ID exclusion)
export async function checkDuplicates(
  phone: string,
  email?: string
): Promise<DuplicateCheckResult> {
  // 📱 Check phone first
  if (phone?.trim()) {
    const phoneExists = await User.findOne({ phone: phone.trim() });
    if (phoneExists) {
      return {
        exists: true,
        field: 'phone',
        message: 'شماره موبایل قبلاً ثبت شده است'
      };
    }
  }

  // 📧 Then check email
  if (email?.trim()) {
    const emailExists = await User.findOne({ email: email.trim() });
    if (emailExists) {
      return {
        exists: true,
        field: 'email',
        message: 'ایمیل قبلاً ثبت شده است'
      };
    }
  }

  return { exists: false };
}

// 🔄 For profile updates (excludes current user)
export async function checkDuplicatesForUpdate(
  userId: string,
  phone?: string,
  email?: string
): Promise<DuplicateCheckResult> {
  // 📱 Check phone first (if provided)
  if (phone?.trim()) {
    const phoneExists = await User.findOne({
      phone: phone.trim(),
      _id: { $ne: userId }
    });

    if (phoneExists) {
      return {
        exists: true,
        field: 'phone',
        message: 'شماره موبایل قبلاً ثبت شده است'
      };
    }
  }

  // 📧 Then check email (if provided)
  if (email?.trim()) {
    const emailExists = await User.findOne({
      email: email.trim(),
      _id: { $ne: userId }
    });

    if (emailExists) {
      return {
        exists: true,
        field: 'email',
        message: 'ایمیل قبلاً ثبت شده است'
      };
    }
  }

  return { exists: false };
}
