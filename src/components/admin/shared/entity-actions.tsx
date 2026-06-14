// ✏️🗑️ Generic edit/delete row actions — one component for doctors & articles. All
//    Persian messages derive from entityLabel → zero drift.
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui/button";
import { confirmToast } from "@/lib/utils/confirm-toast";

interface EntityActionsProps {
  entityLabel: string; // 🏷️ e.g. "doctor" / "article" — drives all messages
  editHref: string;    // ✏️ /admin/doctors/123/edit
  deleteUrl: string;   // 🗑️ /api/admin/doctors/123
}

export default function EntityActions({ entityLabel, editHref, deleteUrl }: EntityActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleDelete() {
    confirmToast({
      title: `حذف ${entityLabel}؟`,
      description: "این عمل برگشت‌پذیر نیست.",
      confirmLabel: "حذف کن",
      onConfirm: async () => {
        setLoading(true);
        const res = await fetch(deleteUrl, { method: "DELETE" });
        if (res.ok) {
          toast.success(`${entityLabel} حذف شد`);
          router.refresh();
        } else {
          toast.error(`خطا در حذف ${entityLabel}`);
        }
        setLoading(false);
      },
    });
  }

  return (
    <div className="flex items-center gap-2">
      {/* ✏️ Edit */}
      <ButtonLink href={editHref} variant="outline" size="icon-sm" aria-label={`ویرایش ${entityLabel}`} className="hover:border-primary-400 hover:text-primary-600">
        <Pencil size={14} />
      </ButtonLink>
      {/* 🗑️ Delete */}
      <Button
        variant="outline"
        size="icon-sm"
        disabled={loading}
        aria-label={`حذف ${entityLabel}`}
        className="hover:border-danger-400 hover:text-danger-600"
        onClick={handleDelete}
      >
        {loading ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={14} />}
      </Button>
    </div>
  );
}
