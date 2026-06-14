import { cn } from "@/lib/utils/cn";

// ✨ Shimmer block — neutral pulse used for every placeholder line/box
const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-neutral-200 rounded-md", className)} />
);

// 🦴 Mirrors <ProfileCard mode="search"> 1:1 (rounding, padding, aspect-ratio, the
//    min-[480px] breakpoint) so real cards swap in with zero layout shift. 🧠
export function ProfileCardSkeleton() {
  return (
    <div className="relative bg-white rounded-xl border border-neutral-100 overflow-hidden">
      <div className="p-3">
        <div className="flex flex-col min-[480px]:flex-row gap-3">

          {/* 🖼️ Image placeholder — same aspect ratios as the real photo frame */}
          <div className="w-full min-[480px]:w-35 sm:w-40 md:w-46.5 shrink-0">
            <Shimmer className="w-full aspect-4/3 min-[480px]:aspect-186/153 rounded-none min-[480px]:rounded-md" />
          </div>

          {/* 🩺 Info placeholder */}
          <div className="flex items-start justify-between grow px-1 min-[480px]:px-0 min-[480px]:pt-1">
            <div className="flex flex-col gap-y-2 sm:gap-y-3 w-full min-w-0">
              <Shimmer className="h-5 w-40 max-w-full rounded-full" />
              <Shimmer className="h-4 w-28 rounded-full" />
              {/* ⭐ Stars */}
              <div className="flex items-center gap-x-1.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Shimmer key={i} className="w-4 h-4 rounded-full" />
                ))}
                <Shimmer className="h-3.5 w-12 rounded-full" />
              </div>
            </div>

            {/* 🪪 Medical code — desktop */}
            <div className="hidden lg:flex items-center gap-x-2 shrink-0 mr-2">
              <Shimmer className="w-4 h-4 rounded-full" />
              <Shimmer className="h-3.5 w-28 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── Secondary info block ── */}
        <div className="mt-3 px-1 min-[480px]:px-0 space-y-2">
          {/* 🪪 Medical code — mobile */}
          <div className="flex lg:hidden items-center gap-x-2 mb-2.5">
            <Shimmer className="w-4 h-4 rounded-full" />
            <Shimmer className="h-3.5 w-28 rounded-full" />
          </div>
          {/* 📍 Address */}
          <div className="flex items-center gap-x-2">
            <Shimmer className="w-4 h-4 rounded-full shrink-0" />
            <Shimmer className="h-3.5 w-24 rounded-full shrink-0" />
            <Shimmer className="h-3.5 w-48 max-w-full rounded-full" />
          </div>
          {/* 🗓️ Next slot */}
          <div className="flex items-center gap-x-2">
            <Shimmer className="w-4 h-4 rounded-full shrink-0" />
            <Shimmer className="h-3.5 w-32 rounded-full shrink-0" />
            <Shimmer className="h-3.5 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-x-3 px-3 py-3 border-t border-neutral-100 mt-1">
        <Shimmer className="h-10 flex-1 rounded-xl" />
        <Shimmer className="h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}
