// ⭐ Review moderation. Auth handled by the route layout.
import { Star } from "lucide-react";
import { formatFaNumber } from "@/lib/utils/persian-format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Metadata } from "next";
import { getDoctorsWithReviews } from "@/lib/services/admin-reviews";
import ReviewModeration from "@/components/admin/reviews/review-moderation";

export const metadata: Metadata = {
  title: "نظرات | پنل ادمین",
  robots: { index: false, follow: false },
};

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const doctors = await getDoctorsWithReviews();
  const pendingTotal = doctors.reduce((sum, d) => sum + d.pendingCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">مدیریت نظرات</h1>
        <p className="mt-1 text-sm text-neutral-500">{formatFaNumber(pendingTotal)} نظر در انتظار تأیید</p>
      </div>

      {doctors.length === 0 ? (
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center text-neutral-400">
          هیچ نظری ثبت نشده است
        </div>
      ) : (
        <div className="space-y-4">
          {doctors.map((doc) => (
            <div key={doc._id} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
              {/* Doctor header */}
              <div className="flex items-center gap-4 border-b border-neutral-100 bg-neutral-50 p-5">
                {/* 👤 Doctor avatar — image with initial fallback */}
                <Avatar size="lg" className="shrink-0">
                  {doc.photo ? <AvatarImage src={doc.photo} alt={doc.name} /> : null}
                  <AvatarFallback className="bg-primary-100 font-bold text-primary-700">{doc.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{doc.name}</p>
                  <p className="text-xs text-neutral-500">{doc.specialty}</p>
                </div>
                <div className="flex gap-2 text-xs">
                  {doc.pendingCount > 0 && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700">
                      {formatFaNumber(doc.pendingCount)} در انتظار
                    </span>
                  )}
                  <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-neutral-600">
                    {formatFaNumber(doc.reviews.length)} نظر
                  </span>
                </div>
              </div>

              {/* Reviews */}
              <div className="divide-y divide-neutral-100">
                {doc.reviews.map((review) => (
                  <div key={review._id} className="flex items-start gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-900">{review.userName}</span>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-xs text-neutral-400">{review.createdAt}</span>
                      </div>
                      <p className="text-sm text-neutral-600">{review.comment}</p>
                    </div>
                    <ReviewModeration doctorId={doc._id} reviewId={review._id} status={review.status} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
