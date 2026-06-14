// ⭐ Admin widget — latest 5 reviews.
//    Uses <Card>, <Badge>, <ButtonLink> — Slot-free link (hydration-safe).
import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Review {
  doctorId:   string;
  doctorName: string;
  userName:   string;
  rating:     number;
  comment:    string;
  status:     string;
  createdAt:  Date;
}

// 🏷️ Status → Badge variant mapping
const STATUS_VARIANT: Record<string, BadgeProps["variant"]> = {
  pending:  "warning",
  approved: "success",
  rejected: "danger",
};
const STATUS_LABEL: Record<string, string> = {
  pending:  "در انتظار",
  approved: "تأیید شده",
  rejected: "رد شده",
};

export default function RecentReviews({ reviews }: { reviews: Review[] }) {
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  if (reviews.length === 0) return null;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* 🏷️ Header */}
      <CardHeader className="flex flex-row items-center justify-between px-5 py-4 [.border-b]:pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-bold text-neutral-900">آخرین نظرات</CardTitle>
          {/* 🔴 Pending alert pulse badge */}
          {pendingCount > 0 && (
            <Badge variant="warning" className="animate-pulse gap-1">
              {/* 🔴 pulse dot — size-1.5 canonical */}
              <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
              {pendingCount} جدید
            </Badge>
          )}
        </div>
        <ButtonLink href="/admin/reviews" variant="link" size="sm" className="h-auto gap-1 p-0 text-sm">
          مشاهده همه
          <ArrowLeft size={14} />
        </ButtonLink>
      </CardHeader>

      <Separator />

      {/* 📋 Review list */}
      <CardContent className="divide-y divide-neutral-100 p-0">
        {reviews.map((r, i) => {
          const variant = STATUS_VARIANT[r.status] ?? "warning";
          const label   = STATUS_LABEL[r.status]   ?? "در انتظار";
          return (
            <div key={i} className="flex items-start gap-4 p-5 transition-colors hover:bg-neutral-50">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">{r.userName}</span>
                  <span className="text-xs text-neutral-400">درباره</span>
                  <Link
                    href={`/admin/reviews?doctor=${r.doctorId}`}
                    className="text-sm font-medium text-primary-600 hover:underline"
                  >
                    {r.doctorName}
                  </Link>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-neutral-600">{r.comment}</p>
              </div>

              {/* ⭐ Rating + status */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={13} fill="currentColor" />
                  <span className="text-xs font-medium">{r.rating}</span>
                </div>
                <Badge variant={variant}>{label}</Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
