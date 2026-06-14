// 📱 Mobile top bar + Sheet drawer. Renders the shared AdminNav inside the sheet.
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AdminUser } from "@/lib/auth/get-admin";
import AdminNav from "@/components/admin/layout/admin-nav";

export default function AdminMobileNav({ admin }: { admin: AdminUser }) {
  // 🔓 Controlled open state for the drawer
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 🚪 Auto-close on navigation — React-docs "adjust state during render" pattern:
  //    no useEffect → no extra commit/flash, no react-hooks/set-state-in-effect warning.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* 🔝 Sticky top bar (mobile only) — stays pinned while the page scrolls */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-neutral-100 bg-white px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary-500">
            <Shield size={13} className="text-white" />
          </div>
          <span className="text-sm font-bold text-neutral-900">پنل مدیریت</span>
        </div>

        {/* 🍔 Hamburger trigger */}
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="باز کردن منو">
            <Menu size={18} />
          </Button>
        </SheetTrigger>
      </header>

      {/* 📜 Drawer — Radix handles close on overlay/escape/built-in X */}
      <SheetContent side="right" className="flex w-72 flex-col p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>منوی ناوبری</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <AdminNav admin={admin} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
