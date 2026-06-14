'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import useSWR from 'swr';
import { SearchX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Pagination from '@/components/shared/pagination';
import ProfileCard from '@/components/shared/profile-card';
import { ProfileCardSkeleton } from '@/components/shared/profile-card-skeleton';
import { useDoctors } from '@/hooks/use-doctors';
import type { DoctorSummary } from '@/hooks/use-doctors';

// 👤 Minimal shape of /api/auth/me — only what we need to derive logged-in state
interface MeResponse { user: unknown | null }
const meFetcher = (url: string): Promise<MeResponse> => fetch(url).then(r => r.json());

// 🩺 The ONLY DB-driven section. Skeletons on first load; a light dim while
//    revalidating after a user action. Filters/sort never live here → never blink. ✨
export default function DoctorList() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // 🔐 Auth resolved client-side via the same SWR key the header uses (deduped, no extra
  //    request, no server cookie read). undefined until it settles so <ActionButtons> probes
  //    lazily instead of treating a logged-in user as a guest. 🧠
  const { data: me } = useSWR<MeResponse>('/api/auth/me', meFetcher, { revalidateOnFocus: false });
  const isLoggedIn = me ? !!me.user : undefined;

  // 🌐 Client-side fetch (SWR). No SSR seed → cards skeleton-load while the stable
  //    shell (filters + sort) is already on screen. keepPreviousData = smooth swaps.
  const { data, isLoading, isValidating } = useDoctors();
  const doctors    = data?.doctors    ?? [];
  const totalPages = data?.totalPages ?? 1;

  // 🧹 Reset to page 1 when totalPages drops below the current page. Deps are complete
  //    (primitives + stable router/searchParams) → no render loop. 🧠
  const pageParam = searchParams.get('page');
  useEffect(() => {
    if (!data) return;
    const currentPage = Number(pageParam ?? 1);
    if (currentPage > data.totalPages) {
      const p = new URLSearchParams(searchParams);
      p.set('page', '1');
      router.replace(`?${p.toString()}`, { scroll: false });
    }
  }, [data, pageParam, searchParams, router]);

  // ✅ Fix: use `doctors.length > 0` not `doctors.length` — avoids rendering the number 0
  const showPagination = !isLoading && doctors.length > 0 && totalPages > 1;

  // ⏳ True first load (no cached/SSR data yet) → full skeleton
  if (isLoading && !data) {
    return (
      <div className="space-y-4 border-b border-neutral-100 pb-4 min-h-60">
        {Array.from({ length: 5 }, (_, i) => <ProfileCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 🩺 Doctor list — dim only on user-initiated revalidation (sort/filter/page) */}
      <div className={cn(
        'space-y-4 border-b border-neutral-100 pb-4 min-h-60 transition-opacity duration-200',
        isValidating && !!data && 'opacity-60 pointer-events-none',
      )}>

        {/* 🔍 Empty state */}
        {doctors.length === 0 && <NoDoctorsFound />}

        {/* ✅ Results — doc is DoctorSummary, all fields are fully typed */}
        {doctors.map((doc: DoctorSummary) => (
          <ProfileCard
            key={doc._id}
            mode="search"
            // exactOptionalPropertyTypes: omit the key while auth is still resolving
            {...(isLoggedIn !== undefined && { isLoggedIn })}
            data={{
              name:         doc.name,
              specialty:    doc.specialty,
              image:        doc.photo || '/images/no-image.png',
              rating:       doc.avgRating,
              reviewsCount: doc.reviewCount,
              medicalCode:  doc.medicalCode,
              address:      doc.address,
              doctorId:     doc._id,
              // exactOptionalPropertyTypes: omit key entirely when null/undefined
              ...(doc.nextAvailableSlot != null && {
                nextAvailableSlot: doc.nextAvailableSlot,
              }),
            }}
            schedule={doc.schedule}
          />
        ))}
      </div>

      {showPagination && <Pagination totalPages={totalPages} className="mt-5 mb-0" />}
    </div>
  );
}

// ─── No Doctors Found ─────────────────────────────────────────────────────────

function NoDoctorsFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">

      {/* 🔵 Icon container */}
      <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 text-primary-400">
        <SearchX size={36} strokeWidth={1.5} />
        {/* subtle decorative ring */}
        <span className="absolute inset-0 rounded-2xl ring-1 ring-primary-100" />
      </div>

      {/* 📝 Text */}
      <div className="space-y-1.5">
        <p className="text-base font-medium text-neutral-800">
          پزشکی یافت نشد
        </p>
        <p className="text-sm text-neutral-600 max-w-60 leading-relaxed">
          فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید
        </p>
      </div>

    </div>
  );
}
