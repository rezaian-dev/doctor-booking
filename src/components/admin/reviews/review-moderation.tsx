// ⭐ Client Component — approve/reject/delete review actions with shadcn Button
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, X, Trash2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ReviewModerationProps {
  doctorId: string;
  reviewId: string;
  status: string;
}

export default function ReviewModeration({ doctorId, reviewId, status }: ReviewModerationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function doAction(action: "approve" | "reject" | "delete") {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/doctors/${doctorId}/reviews/${reviewId}`, {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: action !== "delete" ? JSON.stringify({ status: action === "approve" ? "approved" : "rejected" }) : null,
      });
      if (res.ok) {
        const msgs = { approve: "نظر تأیید شد", reject: "نظر رد شد", delete: "نظر حذف شد" };
        toast.success(msgs[action]);
        router.refresh();
      } else {
        toast.error("خطا در انجام عملیات");
      }
    } catch {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* ✅ Approve */}
      {status !== "approved" && (
        <Button variant="outline" size="icon-sm"
          className="hover:border-secondary-400 hover:text-secondary-600"
          disabled={loading !== null}
          title="تأیید"
          onClick={() => void doAction("approve")}
        >
          {loading === "approve" ? <LoaderCircle size={13} className="animate-spin" /> : <Check size={13} />}
        </Button>
      )}

      {/* ❌ Reject */}
      {status !== "rejected" && (
        <Button variant="outline" size="icon-sm"
          className="hover:border-amber-400 hover:text-amber-600"
          disabled={loading !== null}
          title="رد"
          onClick={() => void doAction("reject")}
        >
          {loading === "reject" ? <LoaderCircle size={13} className="animate-spin" /> : <X size={13} />}
        </Button>
      )}

      {/* 🗑️ Delete */}
      <Button variant="outline" size="icon-sm"
        className="hover:border-danger-400 hover:text-danger-600"
        disabled={loading !== null}
        title="حذف"
        onClick={() => void doAction("delete")}
      >
        {loading === "delete" ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
      </Button>
    </div>
  );
}
