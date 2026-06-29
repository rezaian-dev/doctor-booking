import { Skeleton } from '@/components/ui/skeleton';

// 🦴 Mirrors the redesigned DoctorReview (gradient header → 3 paneled sections → submit) so the
//    real form swaps in with zero layout shift — no sudden pop, smooth perceived load. ✨
function PanelSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 sm:p-5 space-y-3">
      {/* numbered header: chip + title */}
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      {children}
    </div>
  );
}

export default function CommentLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="bg-neutral-30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary-200/50 ring-1 ring-primary-100/60 overflow-hidden animate-fade-in">

        {/* 🎨 Same gradient header → the colored band is there instantly (no grey-to-color flash) */}
        <div className="bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 p-5 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-2 sm:border-3 md:border-4 border-neutral-30/40 bg-neutral-30/30 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded-md bg-neutral-30/20 animate-pulse" />
              <div className="h-5 sm:h-6 w-40 max-w-[60%] rounded-md bg-neutral-30/30 animate-pulse" />
              <div className="h-4 w-20 rounded-full bg-neutral-30/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* 📝 Body */}
        <div className="p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6">
          <Skeleton className="h-4 w-3/4 max-w-sm mx-auto" />

          {/* ① Rating */}
          <PanelSkeleton>
            <div className="flex justify-center gap-2 sm:gap-3 py-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-7 w-24 mx-auto rounded-full" />
          </PanelSkeleton>

          {/* ② Recommend */}
          <PanelSkeleton>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Skeleton className="h-28 sm:h-32 rounded-2xl" />
              <Skeleton className="h-28 sm:h-32 rounded-2xl" />
            </div>
          </PanelSkeleton>

          {/* ③ Comment */}
          <PanelSkeleton>
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-1 w-full rounded-full" />
          </PanelSkeleton>

          {/* 🚀 Submit */}
          <Skeleton className="h-12 sm:h-14 md:h-15 w-full rounded-xl sm:rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
