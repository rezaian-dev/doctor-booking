import { Suspense } from "react";
import type { FilterConfig } from "@/types/filters";
import DoctorFilters from "@/components/features/doctors/doctor-filters";
import DoctorToolbar from "@/components/features/doctors/doctor-toolbar";
import DoctorList from "@/components/features/doctors/doctor-list";
import DoctorListSkeleton from "@/components/features/doctors/doctor-list-skeleton";

interface Props {
  cityGroup: FilterConfig; // 🏙️ DB-sourced (cached) city options
}

// 🩺 Sidebar filters + results grid for /doctors. Filters/toolbar are pure URL/shell UI
//    (no DB/cookie read) → stable on refresh. Only the card list is data-driven & skeleton-
//    loads; auth resolves client-side in <DoctorList> via the shared /api/auth/me cache. ✨
export default function DoctorSearchGrid({ cityGroup }: Props) {
  return (
    <div className="container px-4 md:px-8">
      <div className="grid grid-cols-12 my-5.75 gap-x-5">
        {/* 🖥️ Filters — hidden on mobile. URL-state only → stays mounted, never blinks */}
        <div className="hidden md:block md:col-span-5 lg:col-span-4 xl:col-span-3">
          <DoctorFilters cityGroup={cityGroup} />
        </div>

        {/* 📋 Results column — full width on mobile, offset on xl */}
        <div className="col-span-12 md:col-span-7 xl:col-span-9 xl:mr-6.25">
          <div className="space-y-4">
            {/* 🧭 Toolbar OUTSIDE Suspense → sort/filter UI is stable on every refresh */}
            <DoctorToolbar cityGroup={cityGroup} />

            {/* ⏳ Only the DB-driven cards suspend & skeleton-load */}
            <Suspense fallback={<DoctorListSkeleton />}>
              <DoctorList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
