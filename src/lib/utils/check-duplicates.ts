import { User } from '@/lib/db/models/user';

const MESSAGES = {
  phone: 'این شمارهٔ موبایل قبلاً ثبت شده است.',
  email: 'این ایمیل قبلاً ثبت شده است.',
} as const;

// 🔍 Check single field duplicate
async function check(field: 'phone' | 'email', value: string, excludeId?: string) {
  // 🔑 Use a flexible record to accommodate MongoDB $ne operator on _id
  const query: Record<string, unknown> = { [field]: value.trim() };
  if (excludeId) query._id = { $ne: excludeId };

  const exists = await User.exists(query);
  return exists ? { exists: true, field, message: MESSAGES[field] } : { exists: false };
}

// 🆕 Check duplicates for registration
export async function checkDuplicates(phone: string, email?: string) {
  const phoneCheck = await check('phone', phone);
  if (phoneCheck.exists) return phoneCheck;
  return email?.trim() ? check('email', email) : { exists: false };
}

// ✏️ Check duplicates for updates
export async function checkDuplicatesForUpdate(userId: string, phone?: string, email?: string) {
  if (phone?.trim()) {
    const phoneCheck = await check('phone', phone, userId);
    if (phoneCheck.exists) return phoneCheck;
  }
  return email?.trim() ? check('email', email, userId) : { exists: false };
}
