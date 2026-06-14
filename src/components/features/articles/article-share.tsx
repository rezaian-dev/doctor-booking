"use client";

import { useState } from "react";
import { Link2, Check, Send, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

interface ArticleShareProps {
  title: string; // 📰 used as the share caption
}

/**
 * 🔗 ArticleShare — copy link + messenger deep-links + native share sheet.
 *    URL is read from the browser at click time, so it stays correct on any host.
 */
export default function ArticleShare({ title }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = () => (typeof window === "undefined" ? "" : window.location.href);

  // 📋 Copy the link and flash a confirmation
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl());
      setCopied(true);
      toast.success("لینک مقاله کپی شد");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("کپی لینک ممکن نشد");
    }
  };

  // 📱 Native share sheet when the device supports it
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url: currentUrl() });
      } catch {
        /* 🤫 user dismissed the sheet — nothing to do */
      }
    } else {
      void handleCopy(); // 🔁 graceful fallback
    }
  };

  const encoded = () => ({ url: encodeURIComponent(currentUrl()), text: encodeURIComponent(title) });
  const telegramHref = () => { const e = encoded(); return `https://t.me/share/url?url=${e.url}&text=${e.text}`; };
  const whatsappHref = () => { const e = encoded(); return `https://wa.me/?text=${e.text}%20${e.url}`; };

  const iconBtn =
    "flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-primary-300 hover:text-primary-600 hover:shadow-sm";

  return (
    <div className="flex items-center gap-2">
      <span className="ml-1 flex items-center gap-1.5 text-xs font-medium text-neutral-500">
        <Share2 size={14} aria-hidden /> هم‌رسانی
      </span>

      {/* 📋 Copy link */}
      <button onClick={handleCopy} className={iconBtn} aria-label="کپی لینک مقاله" title="کپی لینک">
        {copied ? <Check size={16} className="text-secondary-600" /> : <Link2 size={16} />}
      </button>

      {/* ✈️ Telegram */}
      <a href={telegramHref()} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="اشتراک در تلگرام" title="تلگرام">
        <Send size={16} />
      </a>

      {/* 💬 WhatsApp */}
      <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="اشتراک در واتساپ" title="واتساپ">
        <MessageCircle size={16} />
      </a>

      {/* 📱 Native share — shown on touch devices that support it */}
      <button onClick={handleNativeShare} className={cn(iconBtn, "sm:hidden")} aria-label="اشتراک‌گذاری" title="اشتراک‌گذاری">
        <Share2 size={16} />
      </button>
    </div>
  );
}
