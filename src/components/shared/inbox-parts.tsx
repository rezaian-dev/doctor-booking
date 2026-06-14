// 📬 Inbox sub-components — extracted from inbox.tsx for readability
// MessageCard, EmptyState, StatsBanner + date helpers
"use client";

import { useState } from "react";
import {
  Mail, MailOpen, ChevronDown, ChevronUp,
  CheckCheck, Clock, Heart, MailX,
  CheckSquare, Square,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button }    from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/cn";
import { formatFaNumber } from "@/lib/utils/persian-format";
import type { InboxMessage } from "@/lib/actions/message";

/* ── Date helpers — Tehran TZ pinned so SSR (server) and client agree ──────── */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fa-IR", {
    year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran",
  });
}
export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fa-IR", {
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran",
  });
}

/* ── MessageCard ─────────────────────────────────────────────────────────── */
export function MessageCard({
  msg, onRead, selected, onSelect, selectionMode,
}: {
  msg:           InboxMessage & { _optimisticRead?: boolean };
  onRead:        (id: string) => void;
  selected:      boolean;
  onSelect:      (id: string) => void;
  selectionMode: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isRead = msg.isRead || msg._optimisticRead;

  // 🔁 Toggle expand; mark read on first open
  const handleToggle = () => {
    if (selectionMode) { onSelect(msg._id); return; }
    if (!expanded && !isRead) onRead(msg._id);
    setExpanded((v) => !v);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all duration-300 shadow-none rounded-2xl cursor-pointer",
        isRead
          ? "bg-white border-neutral-150 hover:border-neutral-300 hover:shadow-sm"
          : "bg-primary-50/60 border-primary-200 shadow-sm shadow-primary-100/60",
        selected && "ring-2 ring-primary-400 border-primary-400",
      )}
    >
      {/* 🔵 Unread right-side accent bar (RTL) */}
      {!isRead && (
        <div className="absolute right-0 top-0 h-full w-1 bg-linear-to-b from-primary-400 to-primary-600 rounded-r-2xl" />
      )}

      <CardHeader className="p-0">
        <Button
          variant="ghost" onClick={handleToggle}
          className="w-full h-auto px-5 py-4 justify-start text-right rounded-2xl hover:bg-transparent focus-visible:ring-0"
        >
          <div className="flex items-start gap-3.5 w-full">
            {/* ✅ Checkbox in selection mode */}
            {selectionMode && (
              <div className="mt-0.5 shrink-0">
                {selected
                  ? <CheckSquare size={18} className="text-primary-500" />
                  : <Square      size={18} className="text-neutral-300" />
                }
              </div>
            )}

            {/* 📧 Mail icon */}
            <div className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
              isRead ? "bg-neutral-100" : "bg-primary-100 shadow-sm shadow-primary-200/60",
            )}>
              {isRead
                ? <MailOpen size={17} className="text-neutral-500" />
                : <Mail     size={17} className="text-primary-600" />
              }
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  {!isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />}
                  <p className={cn(
                    "truncate text-[15px] font-semibold leading-snug",
                    isRead ? "text-neutral-700" : "text-neutral-900",
                  )}>
                    {msg.subject}
                  </p>
                </div>
                <div className="shrink-0 text-neutral-400">
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {!expanded && (
                <p className="mt-1 truncate text-[13px] text-neutral-500 leading-relaxed">
                  {msg.body.slice(0, 90)}{msg.body.length > 90 ? "…" : ""}
                </p>
              )}

              <div className="mt-1.5 flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <Clock size={10} />
                  {formatDate(msg.createdAt)}
                </span>
                <span className="text-[11px] text-neutral-300">·</span>
                <span className="text-[11px] text-neutral-400">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          </div>
        </Button>
      </CardHeader>

      {expanded && (
        <CardContent className="px-5 pb-5 pt-0">
          <Separator className="mb-4 bg-neutral-100" />
          <p className="text-sm leading-8 text-neutral-700 whitespace-pre-wrap">{msg.body}</p>
          {isRead && (
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-neutral-400">
              <CheckCheck size={12} />
              <span>خوانده شده</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-primary-100 to-primary-50 shadow-lg shadow-primary-200/50">
          <MailX size={34} className="text-primary-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
          <Heart size={13} className="text-danger-400" fill="currentColor" />
        </div>
      </div>
      <p className="text-base font-semibold text-neutral-800">صندوق ورودی خالی است</p>
      <p className="mt-2 max-w-xs text-sm text-neutral-500 leading-6">
        پس از بررسی تست سلامت توسط متخصصان،
        <br />
        نتایج اینجا ارسال می‌شود
      </p>
    </div>
  );
}

/* ── StatsBanner ─────────────────────────────────────────────────────────── */
export function StatsBanner({ total, unread }: { total: number; unread: number }) {
  const read          = total - unread;
  const pct           = total > 0 ? Math.round((read / total) * 100) : 100;
  const circumference = 2 * Math.PI * 22;
  const strokeOffset  = circumference * (1 - pct / 100);  // 📐 SVG arc offset

  return (
    <Card className="mb-6 overflow-hidden border-0 rounded-2xl bg-linear-to-l from-primary-700 to-primary-600 shadow-lg shadow-primary-600/25">
      <CardContent className="p-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary-100">
              {unread > 0 ? `${unread} پیام خوانده نشده` : "همه پیام‌ها خوانده شده"}
            </p>
            <p className="mt-0.5 text-2xl font-bold text-white">
              {formatFaNumber(total)} پیام
            </p>
          </div>

          {/* 🔵 Circular SVG progress ring */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle
                cx="28" cy="28" r="22"
                stroke="white" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-700"
              />
            </svg>
            <span className="text-sm font-bold text-white">{pct}%</span>
          </div>
        </div>

        {/* ▬ Linear progress bar */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
