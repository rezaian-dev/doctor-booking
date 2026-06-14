import { Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BookingSuccessDetails from "@/components/features/booking/booking-success-details";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata = pageMetadata({
  title: "نوبت تایید شد | دکتر رزرو",
  description: "نوبت شما با موفقیت ثبت شد.",
  robots: { index: false, follow: false },
});

// 🩺 Stable shell — icon, headings, note & action links render synchronously in the first
//    HTML paint (no useSearchParams here). Only the searchParam-driven details suspend behind
//    a layout-matched skeleton → zero flash, zero shift (the /faq contract). 🧠✨
export default function BookingSuccessPage() {
  return (
    <div className="container px-4 md:px-8 py-10">
      <div className="max-w-lg mx-auto">
        <div className="border border-neutral-100 rounded-2xl bg-white p-8 text-center space-y-6">

          {/* ✅ Success icon */}
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="size-9 text-green-500" strokeWidth={1.5} />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold text-neutral-900">نوبت شما ثبت شد!</h1>
            <p className="text-neutral-500 text-sm mt-1">پرداخت با موفقیت انجام شد</p>
          </div>

          {/* 📋 Appointment details — the ONLY dynamic part; skeleton mirrors its rows 1:1 */}
          <Suspense fallback={<DetailsSkeleton />}>
            <BookingSuccessDetails />
          </Suspense>

          <p className="text-xs text-neutral-400">
            کد پیگیری را یادداشت کنید. در صورت نیاز به لغو یا ویرایش نوبت به آن نیاز خواهید داشت.
          </p>

          {/* 🔘 Actions — ButtonLink (next/link) → SSR-safe, no client JS, no reload */}
          <div className="flex flex-col gap-2">
            <ButtonLink
              href="/appointments"
              className="w-full h-11 rounded-xl bg-primary-500 hover:bg-primary-600 text-white"
            >
              مشاهده نوبت‌های من
            </ButtonLink>
            <ButtonLink
              href="/"
              variant="outline"
              className="w-full h-11 rounded-xl border-neutral-200 text-neutral-600"
            >
              بازگشت به صفحه اصلی
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🦴 Skeleton — 3 info rows + separator + tracking row, same paddings as the real card → no shift.
function DetailsSkeleton() {
  return (
    <div className="border border-neutral-100 rounded-xl p-4 space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
      ))}
      <div className="h-px bg-neutral-100" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-24 rounded-full" />
      </div>
    </div>
  );
}
