// ⏳ Route-level skeleton for /doctors. The page is dynamic (per-filter SEO metadata + DB city
//    list), so navigation does a short server round-trip. Returning null made <main> blank and
//    the footer jump up = the "flash/reload" feel. This mirrors DoctorSearchGrid's grid (filters
//    + toolbar + cards) so the transition is a stable, full-height skeleton → content, zero
//    layout shift — as smooth as the static pages. 🧩✨
import DoctorListSkeleton from '@/components/features/doctors/doctor-list-skeleton';

export default function DoctorsLoading() {
  return (
    <div className="container px-4 md:px-8">
      <div className="my-5.75 grid grid-cols-12 gap-x-5">
        {/* 🖥️ Filters sidebar skeleton — desktop only (matches md:block on the real sidebar) */}
        <aside className="hidden md:col-span-5 md:block lg:col-span-4 xl:col-span-3">
          <div className="space-y-4 rounded-2xl border border-neutral-150 p-4">
            <div className="h-6 w-24 animate-pulse rounded-lg bg-neutral-100" />
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
            ))}
          </div>
        </aside>

        {/* 📋 Results column — toolbar skeleton + card list skeleton (reused 1:1 with the page) */}
        <div className="col-span-12 md:col-span-7 xl:col-span-9 xl:mr-6.25">
          <div className="space-y-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-100" />
            <DoctorListSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
