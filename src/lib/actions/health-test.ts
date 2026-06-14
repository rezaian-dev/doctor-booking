// 🫀 Server Action — save a user's heart-health test result
'use server';

import { connectDB } from '@/lib/db/connection';
import { getCurrentUserId } from '@/lib/auth/current-user';
import { User } from '@/lib/db/models/user';
import { HealthTestResult } from '@/lib/db/models/health-test-result';

export type ActionState = { error?: string; success?: boolean };

// 🔁 Shared admin result shape — single source of truth (also used by the service)
export type TestResultItem = {
  _id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  userAvatar: string; // 🖼️ User profile image (may be empty)
  answers: Record<number, string>;
  createdAt: string;
  repliedAt: string | null; // ✅ null = no admin reply yet
};

/* ── Save health test result (user-facing) ───────────────────────────────── */
export async function saveHealthTestResult(
  answers: Record<number, string>
): Promise<ActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'ابتدا وارد حساب کاربری شوید' };

  await connectDB();

  const user = await User.findById(userId)
    .select('firstName lastName phone email avatar')
    .lean<{ firstName: string; lastName: string; phone?: string; email?: string; avatar?: string }>();
  if (!user) return { error: 'کاربر یافت نشد' };

  await HealthTestResult.create({
    userId,
    answers,
    userName:   `${user.firstName} ${user.lastName}`,
    userPhone:  user.phone  ?? '',
    userEmail:  user.email  ?? '',
    userAvatar: user.avatar ?? '', // 🖼️ Snapshot avatar at test time
    repliedAt:  null,
  });

  return { success: true };
}
