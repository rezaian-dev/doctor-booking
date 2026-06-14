// 📨 Server Actions — admin sends messages, user reads inbox
'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db/connection';
import { getCurrentUserId, requireAdminId } from '@/lib/auth/current-user';
import { Message } from '@/lib/db/models/message';
import { HealthTestResult } from '@/lib/db/models/health-test-result';

/* ── Types ───────────────────────────────────────────────────────────────── */
export type ActionState = { error?: string; success?: boolean };

export type InboxMessage = {
  _id: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

/* ── Send message to user (admin only) ───────────────────────────────────── */
export async function sendMessageToUser(
  _: ActionState,
  formData: FormData
): Promise<ActionState> {
  const adminId = await requireAdminId();
  if (!adminId) return { error: 'دسترسی غیرمجاز' };

  const toUserId     = formData.get('toUserId')     as string;
  const subject      = formData.get('subject')      as string;
  const body         = formData.get('body')         as string;
  const testResultId = formData.get('testResultId') as string | null;

  if (!toUserId || !subject?.trim() || !body?.trim())
    return { error: 'همه فیلدها الزامی هستند' };

  await connectDB();

  // 📨 Create the inbox message
  await Message.create({
    toUserId,
    fromAdminId:  adminId,
    subject:      subject.trim(),
    body:         body.trim(),
    testResultId: testResultId || null,
  });

  // ✅ Mark the health test result as replied — stamp current timestamp
  if (testResultId) {
    await HealthTestResult.updateOne(
      { _id: testResultId, repliedAt: null }, // 🔒 only set once (first reply)
      { repliedAt: new Date() }
    );
  }

  revalidatePath('/admin/health-tests');
  return { success: true };
}

/* ── Get user inbox ──────────────────────────────────────────────────────── */
export async function getUserMessages(): Promise<InboxMessage[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  await connectDB();
  const messages = await Message.find({ toUserId: userId })
    .sort({ createdAt: -1 })
    .lean();

  return messages.map((m) => ({
    _id:       String(m._id),
    subject:   m.subject as string,
    body:      m.body as string,
    isRead:    Boolean(m.isRead),
    createdAt: String(m.createdAt),
  }));
}

/* ── Get unread message count (for header badge) ─────────────────────────── */
export async function getUnreadCount(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) return 0;
  await connectDB();
  return Message.countDocuments({ toUserId: userId, isRead: false });
}

/* ── Mark message as read ────────────────────────────────────────────────── */
export async function markMessageRead(messageId: string): Promise<ActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'دسترسی غیرمجاز' };

  await connectDB();
  await Message.updateOne({ _id: messageId, toUserId: userId }, { isRead: true });
  revalidatePath('/inbox');
  return { success: true };
}

/* ── Delete messages (bulk) ──────────────────────────────────────────────── */
export async function deleteMessages(ids: string[]): Promise<ActionState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: 'دسترسی غیرمجاز' };
  if (!ids.length) return { error: 'هیچ پیامی انتخاب نشده' };

  await connectDB();
  await Message.deleteMany({ _id: { $in: ids }, toUserId: userId });
  revalidatePath('/inbox');
  return { success: true };
}
