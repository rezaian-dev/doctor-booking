import { Send, Instagram, Linkedin, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ContactItem = { readonly number: string; readonly link: string };

export const QUICK_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/doctors", label: "لیست پزشکان" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/about-us", label: "درباره ما" },
  { href: "/contact-us", label: "تماس با ما" },
] as const;

// 🌐 Social links via env so production never ships dead placeholders; any unset handle is
//    dropped (footer only renders icons that point somewhere). Set NEXT_PUBLIC_SOCIAL_WHATSAPP,
//    _INSTAGRAM, _TELEGRAM, _LINKEDIN in your environment. ✨
const SOCIAL_DEFS: readonly { href: string | undefined; icon: LucideIcon; label: string }[] = [
  { href: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP, icon: MessageCircle, label: "واتساپ" }, // 💬 distinct from Telegram's Send icon
  { href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM, icon: Instagram, label: "اینستاگرام" },
  { href: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM, icon: Send, label: "تلگرام" }, // ✈️ paper-plane = Telegram only
  { href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN, icon: Linkedin, label: "لینکدین" },
];

export const SOCIAL_LINKS: readonly { href: string; icon: LucideIcon; label: string }[] =
  SOCIAL_DEFS.filter((s): s is { href: string; icon: LucideIcon; label: string } => Boolean(s.href));

export const MOBILE_NUMBERS: readonly ContactItem[] = [
  { number: "۰۹۱۲ ۳۴۵ ۶۷۸۹", link: "tel:09123456789" },
  { number: "۰۹۱۲ ۳۴۵ ۶۷۹۰", link: "tel:09123456790" },
];

export const OFFICE_NUMBERS: readonly ContactItem[] = [
  { number: "۰۲۱-۷۷ ۴۲۵۸۶۷", link: "tel:02177425867" },
  { number: "۰۲۱-۷۷ ۴۲۵۸۶۸", link: "tel:02177425868" },
];
