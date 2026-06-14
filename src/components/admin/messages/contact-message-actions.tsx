// ✉️ Reply to a contact message — shadcn Dialog (replaces the hand-rolled modal).
"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Reply, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { replyToContactMessage, type ReplyActionState } from "@/lib/actions/contact-reply";

interface Props {
  messageId: string;
  currentStatus: string;
  senderName: string;
  senderPhone: string;
  originalMessage: string;
}

export default function ContactMessageActions({
  messageId, currentStatus, senderName, senderPhone, originalMessage,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // 🎬 Wrap the server action on the client: success/error side effects run right
  //    after `await` — no useEffect, no cascading re-render (react-hooks warning). ✨
  const [, formAction, isPending] = useActionState<ReplyActionState, FormData>(
    async (prev, formData) => {
      const result = await replyToContactMessage(prev, formData);
      if (result.success) { setOpen(false); toast.success("پاسخ با موفقیت ارسال شد"); router.refresh(); }
      if (result.error) toast.error(result.error);
      return result;
    },
    {},
  );

  // ✅ Already replied — show a status badge only
  if (currentStatus === "replied") {
    return (
      <Badge variant="success" className="gap-1.5 px-3 py-1.5">
        <Send size={11} /> پاسخ داده شد
      </Badge>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-primary-300 px-3 text-xs text-primary-700 hover:bg-primary-50">
          <Reply size={13} /> پاسخ دادن
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>پاسخ به پیام</DialogTitle>
          <DialogDescription>از: {senderName} — {senderPhone}</DialogDescription>
        </DialogHeader>

        {/* 📨 Original message preview */}
        <div>
          <p className="mb-1.5 text-xs font-semibold text-neutral-500">پیام اصلی:</p>
          <p className="line-clamp-3 rounded-xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-600">{originalMessage}</p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="messageId" value={messageId} />
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-700" htmlFor="replyText">متن پاسخ</label>
            <Textarea id="replyText" name="replyText" rows={5} required className="resize-none leading-7" placeholder="پاسخ خود را بنویسید..." />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? "در حال ارسال..." : <><Send size={14} /> ارسال پاسخ</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
