// ✉️ Contact messages inbox. Auth handled by the route layout; data via the service.
import type { Metadata } from "next";
import { formatFaNumber } from "@/lib/utils/persian-format";
import Link from "next/link";
import { Mail, Phone, MessageSquare, Clock, Reply } from "lucide-react";
import { getAdminContactMessages } from "@/lib/services/admin-contact-messages";
import Pagination from "@/components/shared/pagination";
import ContactMessageActions from "@/components/admin/messages/contact-message-actions";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "پیام‌های تماس | پنل ادمین",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// 🎨 Per-status visual config (UI concern — icon / color / label)
const STATUS_CFG = {
  new:     { label: "جدید",      variant: "default" as const,   icon: MessageSquare, color: "text-blue-600",  bg: "bg-blue-50" },
  replied: { label: "پاسخ داده", variant: "success" as const,   icon: Reply,         color: "text-green-600", bg: "bg-green-50" },
  seen:    { label: "دیده شده",  variant: "secondary" as const, icon: Clock,         color: "text-amber-600", bg: "bg-amber-50" },
};

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function ContactMessagesPage({ searchParams }: PageProps) {
  const { page: pageParam, status = "" } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { messages, total, totalPages, stats } = await getAdminContactMessages(page, status);

  // 🃏 Only "new" + "replied" surface as stat cards / tabs
  const cards = [
    { key: "new" as const,     ...STATUS_CFG.new,     count: stats.new },
    { key: "replied" as const, ...STATUS_CFG.replied, count: stats.replied },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">پیام‌های تماس</h1>
        <p className="mt-0.5 text-sm text-neutral-500">{formatFaNumber(total)} پیام</p>
      </div>

      {/* 📊 Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
        {cards.map(({ key, icon: Icon, color, bg, label, count }) => (
          <Link
            key={key}
            href={`?status=${key}`}
            className={`cursor-pointer rounded-2xl border p-4 transition-all hover:shadow-md ${
              status === key ? "border-primary-200 ring-2 ring-primary-400" : "border-neutral-100 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-xl p-2 ${bg}`}>
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{formatFaNumber(count)}</p>
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 🔖 Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[{ key: "", label: "همه" }, ...cards].map(({ key, label }) => (
          <Link
            key={key}
            href={key ? `?status=${key}` : "?"}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              status === key ? "bg-primary-500 text-white" : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 📨 Messages list */}
      {messages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-16 text-center">
          <MessageSquare size={40} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm text-neutral-400">پیامی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => {
            const cfg = STATUS_CFG[msg.status] ?? STATUS_CFG.new;
            const Icon = cfg.icon;
            return (
              <div
                key={msg._id}
                className={`rounded-2xl border bg-white p-5 transition-shadow hover:shadow-md ${
                  msg.status === "replied" ? "border-green-100 bg-green-50/30" : "border-neutral-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <div className={`rounded-lg p-1.5 ${cfg.bg}`}>
                        <Icon size={14} className={cfg.color} />
                      </div>
                      <span className="font-semibold text-neutral-900">{msg.fullName}</span>
                      <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">{msg.requestType}</span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                        <Phone size={13} className="text-neutral-400" />
                        <span dir="ltr">{msg.phone}</span>
                      </div>
                      {msg.email && (
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                          <Mail size={13} className="text-neutral-400" />
                          <span>{msg.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock size={12} />
                        <span>{msg.createdAt}</span>
                      </div>
                    </div>

                    <p className="line-clamp-3 rounded-xl bg-neutral-50 p-3 text-sm leading-relaxed text-neutral-700">
                      {msg.message}
                    </p>
                  </div>

                  <ContactMessageActions
                    messageId={msg._id}
                    currentStatus={msg.status}
                    senderName={msg.fullName}
                    senderPhone={msg.phone}
                    originalMessage={msg.message}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && <Pagination totalPages={totalPages} />}
    </div>
  );
}
