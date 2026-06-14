// 👥 Client Component — per-user row actions: role toggle, ban/unban, delete.
//    Each action confirms via confirmToast, then refreshes the server tree.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Ban, UserCheck, ShieldCheck, User, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { confirmToast } from "@/lib/utils/confirm-toast";

interface UserActionsProps { userId: string; currentRole: string; isBanned: boolean }

export default function UserActions({ userId, currentRole, isBanned }: UserActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const isLoading = loading !== null;

  async function doDelete() {
    setLoading("delete");
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) { toast.success("کاربر حذف شد"); router.refresh(); }
    else toast.error("خطا در حذف کاربر");
    setLoading(null);
  }

  async function doBan() {
    setLoading("ban");
    const res = await fetch(`/api/admin/users/${userId}/ban`, { method: "PATCH" });
    if (res.ok) { toast.success(isBanned ? "مسدودیت رفع شد" : "کاربر مسدود شد"); router.refresh(); }
    else toast.error("خطا در عملیات");
    setLoading(null);
  }

  async function doRole(role: string) {
    setLoading("role");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) { toast.success(`نقش به ${role === "admin" ? "ادمین" : "کاربر"} تغییر یافت`); router.refresh(); }
    else toast.error("خطا در تغییر نقش");
    setLoading(null);
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Role toggle */}
      {currentRole !== "admin" ? (
        <Button variant="outline" size="icon-sm" disabled={isLoading} title="ارتقا به ادمین"
          className="hover:border-primary-400 hover:text-primary-600"
          onClick={() => confirmToast({ title: "ارتقا به ادمین؟", description: "این کاربر به دسترسی کامل ادمین خواهد رسید.", confirmLabel: "تأیید", confirmVariant: "default", onConfirm: () => doRole("admin") })}>
          {loading === "role" ? <LoaderCircle size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
        </Button>
      ) : (
        <Button variant="outline" size="icon-sm" disabled={isLoading} title="تغییر به کاربر"
          className="hover:border-neutral-400 hover:text-neutral-700"
          onClick={() => confirmToast({ title: "تغییر نقش به کاربر؟", confirmLabel: "تأیید", confirmVariant: "default", onConfirm: () => doRole("user") })}>
          {loading === "role" ? <LoaderCircle size={13} className="animate-spin" /> : <User size={13} />}
        </Button>
      )}

      {/* Ban / unban */}
      <Button variant="outline" size="icon-sm" disabled={isLoading}
        title={isBanned ? "رفع مسدودیت" : "مسدود کردن"}
        className="hover:border-amber-400 hover:text-amber-600"
        onClick={() => confirmToast({
          title: isBanned ? "رفع مسدودیت کاربر؟" : "مسدود کردن کاربر؟",
          description: isBanned ? "کاربر دوباره قادر به ورود خواهد بود." : "کاربر قادر به ورود نخواهد بود.",
          confirmLabel: "تأیید", confirmVariant: "warning", onConfirm: () => doBan(),
        })}>
        {loading === "ban" ? <LoaderCircle size={13} className="animate-spin" /> : isBanned ? <UserCheck size={13} /> : <Ban size={13} />}
      </Button>

      {/* Delete */}
      <Button variant="outline" size="icon-sm" disabled={isLoading} title="حذف کاربر"
        className="hover:border-danger-400 hover:text-danger-600"
        onClick={() => confirmToast({ title: "حذف کاربر؟", description: "این عمل برگشت‌پذیر نیست.", confirmLabel: "حذف کن", onConfirm: () => doDelete() })}>
        {loading === "delete" ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
      </Button>
    </div>
  );
}
