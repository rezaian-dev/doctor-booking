// 🏥 Health-test sub-components: risk calc, send-message dialog, result cards.
//    All badges use <Badge>, all buttons use <Button>, cards use <Card>. ✅
"use client";

import { useState, useActionState } from "react";
import {
  Send, ChevronDown, ChevronUp, Clock, Phone, Mail,
  Activity, CheckCircle2, CircleDashed, User,
} from "lucide-react";
import { toast }    from "sonner";
import { Button }   from "@/components/ui/button";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge }    from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label }    from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jalaliDateTimeFa } from "@/hooks/use-jalaali";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { sendMessageToUser, type ActionState } from "@/lib/actions/message";
import type { TestResultItem } from "@/lib/actions/health-test";

/* ── Quiz question labels ─────────────────────────────────────────────────── */
export const QUESTIONS: Record<number, { label: string; options: Record<string, string> }> = {
  1:  { label: "سن",                  options: { under40: "کمتر از ۴۰", "40-50": "۴۰ تا ۵۰", "50-60": "۵۰ تا ۶۰", over60: "۶۰ یا بیشتر" } },
  2:  { label: "جنسیت",               options: { male: "مرد", female: "زن" } },
  3:  { label: "سابقه قلبی خانوادگی", options: { yes: "دارم", unknown: "خبر ندارم", no: "ندارم" } },
  4:  { label: "سیگار",               options: { current: "سیگاری فعال", former: "ترک کرده", never: "هرگز" } },
  5:  { label: "BMI",                 options: { normal: "طبیعی (<۲۵)", overweight: "اضافه وزن", obese: "چاق (>۳۰)", unknown: "نمی‌دانم" } },
  6:  { label: "فعالیت بدنی",         options: { yes: "بله", no: "خیر" } },
  7:  { label: "فشار خون بالا",       options: { yes: "بله", no: "خیر", unknown: "نمی‌دانم" } },
  8:  { label: "کلسترول بالا",        options: { yes: "بله", no: "خیر", unknown: "نمی‌دانم" } },
  9:  { label: "دیابت",               options: { yes: "بله", no: "خیر", unknown: "نمی‌دانم" } },
  10: { label: "درد قفسه سینه",       options: { yes: "بله", no: "خیر" } },
};

/* ── Risk calculator ─────────────────────────────────────────────────────── */
// 🔴 Returns variant key matching the <Badge> variants in badge.tsx
export function getRisk(answers: Record<number, string>): { label: string; variant: "danger" | "warning" | "success" } {
  let r = 0;
  if (answers[1] === "50-60")      r++;
  if (answers[1] === "over60")     r += 2;
  if (answers[3] === "yes")        r++;
  if (answers[4] === "current")    r += 2;
  if (answers[4] === "former")     r++;
  if (answers[5] === "obese")      r += 2;
  if (answers[5] === "overweight") r++;
  if (answers[6] === "no")         r++;
  if (answers[7] === "yes")        r += 2;
  if (answers[8] === "yes")        r++;
  if (answers[9] === "yes")        r += 2;
  if (answers[10] === "yes")       r += 3;
  if (r >= 8) return { label: "ریسک بالا",   variant: "danger" };
  if (r >= 4) return { label: "ریسک متوسط",  variant: "warning" };
  return        { label: "ریسک پایین",        variant: "success" };
}

/* ── Send Message Dialog ─────────────────────────────────────────────────── */
export function SendMessageModal({ result, onSent }: {
  result: TestResultItem;
  onSent: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  // 🎬 Wrap server action — side effects run after await, no useEffect needed
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    async (prev, formData) => {
      const res = await sendMessageToUser(prev, formData);
      if (res.success) { onSent(result._id); setOpen(false); toast.success("پیام با موفقیت ارسال شد"); }
      return res;
    },
    {},
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Send size={12} /> ارسال پیام
        </Button>
      </DialogTrigger>

      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>ارسال پیام</DialogTitle>
          <DialogDescription>به: {result.userName}</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="toUserId"     value={result.userId} />
          <input type="hidden" name="testResultId" value={result._id} />

          <div className="space-y-1.5">
            <Label htmlFor="subject">موضوع</Label>
            <Input id="subject" name="subject" defaultValue="نتیجه تست سلامت قلب و عروق" placeholder="موضوع پیام..." />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">متن پیام</Label>
            <Textarea
              id="body" name="body" rows={7}
              defaultValue={`کاربر گرامی ${result.userName},\n\nنتیجه تست سلامت قلب و عروق شما به شرح زیر می‌باشد:\n\n`}
              className="resize-none leading-7" placeholder="متن پیام..."
            />
          </div>

          {/* ⚠️ Error slot — reserved height avoids layout shift */}
          <p role="alert" aria-live="polite"
             className="h-4 text-xs text-red-500 transition-opacity duration-200"
             style={{ opacity: state.error ? 1 : 0 }}>
            {state.error ?? "\u200c"}
          </p>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <>
                  {/* ⏳ Spinner — size-4 canonical */}
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  در حال ارسال...
                </>
              ) : (
                <><Send size={14} /> ارسال پیام</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Reply status badge ──────────────────────────────────────────────────── */
export function ReplyBadge({ repliedAt }: { repliedAt: string | null }) {
  if (repliedAt) {
    const date = jalaliDateTimeFa(repliedAt, { year: false }); // 🔒 deterministic, no Intl
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 size={10} /> پاسخ داده شد · {date}
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="gap-1">
      <CircleDashed size={10} /> بدون پاسخ
    </Badge>
  );
}

/* ── Result Card ─────────────────────────────────────────────────────────── */
export function ResultCard({ result, onReplied }: {
  result:    TestResultItem;
  onReplied: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const risk = getRisk(result.answers);

  const date = jalaliDateTimeFa(result.createdAt); // 🔒 deterministic, no Intl

  return (
    <Card className={`gap-0 overflow-hidden p-0 transition-all duration-200 hover:shadow-md ${result.repliedAt ? "bg-neutral-50/80" : ""}`}>
      <CardContent className="flex items-start gap-3 p-4 sm:p-5">
        {/* 👤 Avatar */}
        <Avatar size="lg" className="shrink-0">
          {result.userAvatar ? <AvatarImage src={result.userAvatar} alt={result.userName} /> : null}
          <AvatarFallback className="bg-primary-100 font-bold text-primary-700">
            {result.userName[0] ?? <User size={16} />}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-neutral-900">{result.userName}</p>
            {/* 🔴 Risk badge */}
            <Badge variant={risk.variant}>{risk.label}</Badge>
            <ReplyBadge repliedAt={result.repliedAt} />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            {result.userPhone && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Phone size={10} />{result.userPhone}
              </span>
            )}
            {result.userEmail && (
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Mail size={10} />{result.userEmail}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Clock size={10} />{date}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {!result.repliedAt && <SendMessageModal result={result} onSent={onReplied} />}
          {/* 🔽 Expand toggle — Button ghost variant */}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded
              ? <ChevronUp   size={14} className="text-neutral-500" />
              : <ChevronDown size={14} className="text-neutral-500" />
            }
          </Button>
        </div>
      </CardContent>

      {/* 📋 Expanded answers */}
      {expanded && (
        <>
          <Separator />
          <CardContent className="px-4 pb-4 pt-3 sm:px-5">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
              <Activity size={11} />پاسخ‌های تست
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(QUESTIONS).map(([qId, q]) => {
                const ansKey   = result.answers[Number(qId)];
                const ansLabel = ansKey ? (q.options[ansKey] ?? ansKey) : "—";
                const isRisky  = (
                  (["7", "9", "10"].includes(qId) && ansKey === "yes") ||
                  (qId === "4" && ansKey === "current") ||
                  (qId === "5" && ansKey === "obese")
                );
                return (
                  <div key={qId}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${isRisky ? "border border-red-100 bg-red-50" : "bg-neutral-50"}`}
                  >
                    <span className="font-medium text-neutral-600">{q.label}</span>
                    <span className={`font-semibold ${isRisky ? "text-red-600" : "text-neutral-800"}`}>{ansLabel}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
