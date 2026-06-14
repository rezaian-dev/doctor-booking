// 📬 Server Action — admin replies to a contact message
// ✅ Status changes to "replied" ONLY after actual reply is sent
'use server';

import { revalidatePath } from 'next/cache';
import { connectDB } from '@/lib/db/connection';
import { requireAdminId } from '@/lib/auth/current-user';
import { ContactMessage } from '@/lib/db/models/contact-message';

export type ReplyActionState = { error?: string; success?: boolean };

export async function replyToContactMessage(
  _: ReplyActionState,
  formData: FormData
): Promise<ReplyActionState> {
  const admin = await requireAdminId();
  if (!admin) return { error: 'دسترسی غیرمجاز' };

  const messageId = formData.get('messageId') as string;
  const replyText = (formData.get('replyText') as string)?.trim();

  if (!messageId) return { error: 'شناسه پیام نامعتبر است' };
  if (!replyText) return { error: 'متن پاسخ نمی‌تواند خالی باشد' };

  await connectDB();

  // ✅ Mark as replied — only when admin actually sends a reply
  const updated = await ContactMessage.findByIdAndUpdate(
    messageId,
    {
      status: 'replied',
      repliedAt: new Date(),
      adminReply: replyText,
    },
    { new: true }
  );

  if (!updated) return { error: 'پیام یافت نشد' };

  revalidatePath('/admin/contact-messages');
  return { success: true };
}
