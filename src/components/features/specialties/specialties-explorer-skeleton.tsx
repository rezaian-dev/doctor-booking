import { Skeleton } from '@/components/ui/skeleton';

// ✨ Shimmer block — matches the subtle neutral tone used in profile-card-skeleton
const Shimmer = ({ className }: { className?: string }) => (
  <Skeleton className={`bg-neutral-200 ${className ?? ''}`} />
);

// 🃏 Single card skeleton — mirrors <SpecialtyCard> in specialties-explorer.tsx 1:1:
//    rounded-2xl border, p-4, gap-y-3, icon chip (size-11 rounded-xl), h3, 2-line desc, CTA row
function SpecialtyCardSkeleton() {
  return (
    <div className="relative flex flex-col gap-y-3 rounded-2xl border border-neutral-100 bg-white p-4">
      {/* 🏷️ Availability badge — top-left, absolute */}
      <Shimmer className="absolute top-3 left-3 h-5 w-14 rounded-full" />

      {/* 🎯 Icon chip */}
      <Shimmer className="size-11 rounded-xl shrink-0" />

      {/* 🏷️ Title */}
      <Shimmer className="h-4 w-3/4 rounded-full" />

      {/* 📝 Description — 2 lines */}
      <div className="flex flex-col gap-y-1.5">
        <Shimmer className="h-3 w-full rounded-full" />
        <Shimmer className="h-3 w-2/3 rounded-full" />
      </div>

      {/* 🔗 CTA ghost */}
      <Shimmer className="mt-auto h-3 w-24 rounded-full" />
    </div>
  );
}

// ⏳ Full page skeleton — matches <SpecialtiesExplorer> layout exactly:
//    search box → count line → auto-rows-fr grid
export default function SpecialtiesExplorerSkeleton() {
  return (
    <div className="container px-4 md:px-8 pb-12">
      {/* 🔍 Search box placeholder */}
      <Shimmer className="relative mt-5 h-11 max-w-md rounded-lg" />

      {/* #️⃣ Count line */}
      <Shimmer className="mt-3 h-3 w-20 rounded-full" />

      {/* 🧱 Grid — same breakpoints as the real grid */}
      <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }, (_, i) => (
          <SpecialtyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
