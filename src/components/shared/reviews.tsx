// 🔒 'use client' + Tehran-pinned TZ: client components are SSR-prerendered, so
//    server & browser must format fa-IR dates identically to avoid hydration drift
"use client";

import { useState } from "react";
import useSWR from "swr";
import { ThumbsUp, MessageSquarePlus, ChevronDown, Star, CheckCircle2 } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/button";
import UserTestimonialCard from "@/components/features/home/user-testimonial-card";
import { Review } from "@/lib/services/doctors";

// 👤 Minimal current-user shape; used only to match against review.userId client-side
const meFetcher = (url: string): Promise<{ user: { id?: string } | null }> => fetch(url).then(r => r.json());

interface ReviewsProps {
  reviews?:     Review[];
  doctorId?:    string;     // 🛡️ Optional — link hidden when absent
  avgRating?:   number;
  reviewCount?: number;
  recommendPct?: number;
  hasReviewed?: boolean;    // 🔒 Already reviewed → static badge instead of submit CTA
}

export default function Reviews({ reviews = [], doctorId = "", avgRating = 0, reviewCount = 0, recommendPct = 0, hasReviewed: hasReviewedProp }: ReviewsProps) {

  // 🔒 Resolve "already reviewed?" client-side so the doctor page reads no server cookie
  //    (stays static → no flash). Reviews carry userId; we just need the current user's id.
  //    undefined until /api/user/me settles → the CTA reserves space (no swap/flash). ✨
  const { data: me } = useSWR("/api/user/me", meFetcher, { revalidateOnFocus: false });
  const hasReviewed =
    hasReviewedProp ??
    (me === undefined ? undefined : !!me.user?.id && reviews.some(r => r.userId === me.user!.id));

  // 📋 Visitors only see approved reviews
  const approved = reviews.filter(r => r.status === "approved");

  // 🔽 Progressive reveal — show a first batch, then load more in steps
  const STEP = 3;
  // ⏱️ Static delay classes (JIT-detectable) for a staggered reveal — one per position in a batch
  const REVEAL_DELAY = ["delay-0", "delay-75", "delay-150"] as const;
  const [visibleCount, setVisibleCount] = useState(STEP);
  const visibleReviews = approved.slice(0, visibleCount);
  const hasMore        = visibleCount < approved.length; // ⬇️ more left to reveal?

  return (
    <section className="my-10 px-5 pb-2 rounded-[12px] border border-neutral-100">
      <h4 className="text-lg font-medium mb-4 mt-2">نظرات کاربران</h4>

      {/* ── Stats row ── */}
      <div className="flex items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-x-52">

          {/* ⭐ Average rating */}
          <div className="flex items-center gap-x-1.5">
            <div className="flex items-center text-alert flex-row-reverse">
              <span className="ml-1">{avgRating}</span>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={18} aria-hidden className={i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-neutral-300 fill-neutral-300"} />
              ))}
            </div>
            <span className="text-base text-neutral-500">({reviewCount} نظر)</span>
          </div>

          {/* 👍 Recommendation percentage */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-x-1">
              <ThumbsUp size={20} color="#60C61D" />
              <span className="text-neutral-600 text-[10px] sm:text-[13px]">
                {recommendPct}% مراجعان این پزشک را پیشنهاد داده‌اند
              </span>
            </div>
          )}
        </div>

        {/* 💬 Submit review CTA — replaced by a static badge once the user reviewed.
            While auth is still resolving (undefined), reserve the slot so nothing swaps. */}
        {hasReviewed === undefined ? (
          <span className="shrink-0 h-9 w-17.5 sm:w-26" aria-hidden />
        ) : hasReviewed ? (
          <span className="shrink-0 inline-flex items-center gap-x-1 h-9 px-3 text-xs sm:text-sm font-medium text-secondary-600 bg-secondary-50 border border-secondary-200 rounded-xl">
            <CheckCircle2 size={16} className="text-secondary-500" />
            نظر شما ثبت شده
          </span>
        ) : (
          <ButtonLink
            href={`/doctors/${doctorId}/comment`}
            variant="outline"
            size="sm"
            className="shrink-0 h-9 w-17.5 sm:w-26 text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-white transition-colors group"
          >
            ثبت نظر
            <MessageSquarePlus size={16} className="text-primary-500 group-hover:text-white transition-colors" />
          </ButtonLink>
        )}
      </div>

      {/* ── Review list ── */}
      {reviewCount === 0 ? (
        <p className="text-center text-neutral-400 py-10 text-sm">هنوز نظری ثبت نشده.</p>
      ) : (
        <ul className="space-y-0">
          {visibleReviews.map((review, i) => (
            // ✨ The card's root IS the <li> — animate it directly so revealed cards fade + slide up.
            //    Static delay classes (i % STEP ∈ 0..2) keep the stagger JIT-detectable. 🧠
            <UserTestimonialCard
              key={review._id}
              userName={review.userName}
              userImage={review.userAvatar ?? ''}
              rating={review.rating}
              date={new Date(review.createdAt).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Tehran" })}
              comment={review.comment}
              showDoctorReference={false}
              expandable
              className={`border-t mt-2 p-4 last:border-b-0 animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both duration-500 ease-out ${REVEAL_DELAY[i % STEP] ?? "delay-0"}`}
            />
          ))}
        </ul>
      )}

      {/* 🔽 Load more — only while there are hidden reviews left */}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setVisibleCount(c => c + STEP)}
          className="group flex mx-auto gap-x-1 h-9 max-w-33.5 text-primary-500 hover:text-primary-600 hover:bg-transparent"
        >
          نظرات بیشتر
          <ChevronDown size={16} color="#4179F0" className="transition-transform duration-300 group-hover:translate-y-0.5" />
        </Button>
      )}
    </section>
  );
}
