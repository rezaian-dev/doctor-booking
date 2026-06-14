// 🚪 Logout confirmation via the standard shadcn Dialog (not AlertDialog) — the spec
//    wants ESC and outside-click to dismiss, which is Radix Dialog's built-in behavior. ✨
"use client";

import { useState } from "react";
import { LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LogoutButton() {
  // 🔄 Loading state — blocks double-submit; never reset (the page unloads on success)
  const [loading, setLoading] = useState(false);

  // 🚪 Logout: drop the session server-side, then HARD-navigate home. A full document
  //    replace (not router.push) avoids the portalled Dialog flashing over the next page,
  //    and resets every client cache (SWR/auth) for free. 🧠✨
  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // 🛡️ Ignore — cookies are cleared server-side; we redirect home regardless.
    }
    window.location.replace("/");
  }

  return (
    <Dialog>
      {/* 🎯 Trigger: the visible logout button in the sidebar */}
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-danger-600 hover:bg-danger-50 hover:text-danger-700"
        >
          <LogOut size={17} />
          خروج از حساب
        </Button>
      </DialogTrigger>

      {/* 🪟 Confirmation dialog — closes on ESC / outside-click out of the box */}
      <DialogContent dir="rtl" className="max-w-sm">
        <DialogHeader>
          <DialogTitle>خروج از حساب</DialogTitle>
          <DialogDescription>
            آیا مطمئن هستید که می‌خواهید از پنل مدیریت خارج شوید؟
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {/* ❌ Cancel — dismisses dialog, no action */}
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              انصراف
            </Button>
          </DialogClose>

          {/* ✅ Confirm — triggers actual logout */}
          <Button
            variant="destructive"
            disabled={loading}
            onClick={() => void handleLogout()}
          >
            {loading && <LoaderCircle size={14} className="animate-spin" />}
            {loading ? "در حال خروج..." : "بله، خارج شو"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
