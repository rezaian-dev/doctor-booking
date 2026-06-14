// 🧭 Client nav — active state derived from usePathname (no currentPath prop drilling).
// Shared verbatim by the desktop aside and the mobile Sheet.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  FileText,
  MessageSquare,
  Heart,
  Mail,
} from "lucide-react";
import type { AdminUser } from "@/lib/auth/get-admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/admin/layout/logout-button";

// 🗺️ Single navigation source of truth
const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "دکترها", icon: Stethoscope },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/articles", label: "مقالات", icon: FileText },
  { href: "/admin/reviews", label: "نظرات", icon: MessageSquare },
  { href: "/admin/health-tests", label: "تست سلامت", icon: Heart },
  { href: "/admin/contact-messages", label: "پیام‌های تماس", icon: Mail },
] as const;

export default function AdminNav({ admin }: { admin: AdminUser }) {
  const pathname = usePathname();

  return (
    // 🧱 Fills the remaining sidebar height (flex child) → logout stays pinned to the bottom.
    <div className="flex flex-1 flex-col">
      {/* 👤 Admin profile card */}
      <div className="border-b border-neutral-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-primary-50 p-3">
          {/* 👤 Admin avatar — image with initials fallback */}
          <Avatar className="shrink-0">
            {admin.avatar ? <AvatarImage src={admin.avatar} alt={admin.firstName} /> : null}
            <AvatarFallback className="bg-primary-100 text-xs font-bold text-primary-700">
              {admin.firstName?.[0]}
              {admin.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900">
              {admin.firstName} {admin.lastName}
            </p>
            <p className="truncate text-xs text-primary-600">{admin.email}</p>
          </div>
        </div>
      </div>

      {/* 🔗 Navigation links — active state from current pathname. Scrolls if tall. */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          // ✅ Exact match for root, prefix match for sub-routes
          const isActive =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* 🚪 Logout (own AlertDialog confirmation) */}
      <div className="border-t border-neutral-100 p-4">
        <LogoutButton />
      </div>
    </div>
  );
}
