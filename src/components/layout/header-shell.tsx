// 🧱 Shared presentational header chrome (logo + centered nav + slots). Hookless Server
//    Component used by both the dynamic Header and static HomeHeader; only auth slots differ. 🧠
import type { ReactNode } from "react";
import Link from "next/link";

import { NavActiveLink } from "@/components/shared/nav-active-link";

// 🧭 Primary navigation — single source of truth for every header variant
export const NAV_ITEMS = [
  { href: "/doctors",    label: "لیست پزشکان"  },
  { href: "/faq",        label: "سوالات متداول" },
  { href: "/about-us",   label: "درباره ما"      },
  { href: "/contact-us", label: "تماس با ما"     },
] as const;

// 🔗 Shape of a single nav entry — explicit (not derived from NAV_ITEMS),
//    so href/label stay widened to `string` for all header consumers. 🧠
export interface NavItem { href: string; label: string }

interface HeaderShellProps {
  mobileSlot:      ReactNode; // 📱 mobile auth/menu widget
  desktopUserSlot: ReactNode; // 🖥️ desktop auth widget
}

export function HeaderShell({ mobileSlot, desktopUserSlot }: HeaderShellProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-150 bg-white/95 backdrop-blur-sm">
      <div className="container relative mx-auto flex h-16 items-center justify-between px-4 md:px-8">

        {/* ── Mobile row ── */}
        <div className="flex items-center md:hidden w-full justify-between">{mobileSlot}</div>

        {/* ── Desktop logo ── */}
        <Link href="/" className="z-10 hidden items-center gap-2 md:flex" aria-label="صفحه اصلی">
          <img src="/images/logo.jpg" alt="دکتر رزرو" width={32} height={32} className="size-8" />
          <span className="text-lg font-medium">دکتر <span className="text-primary-600">رزرو</span></span>
        </Link>

        {/* ── Desktop nav ──
            🔒 Absolutely centered on the header (not a flex sibling) so its position is
            decoupled from the logo/user-widget width — the nav never shifts horizontally
            when the user widget swaps from skeleton → dropdown on the client. */}
        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex"
          aria-label="ناوبری اصلی"
        >
          {NAV_ITEMS.map(({ href, label }) => (
            <NavActiveLink key={href} href={href} label={label} />
          ))}
        </nav>

        {/* ── Desktop user widget ── */}
        <div className="z-10 hidden md:block">{desktopUserSlot}</div>

      </div>
    </header>
  );
}
