'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';

import DoctorFiltersSheet from './doctor-filters-sheet';
import SortSheet from './sort-sheet';
import type { FilterConfig } from '@/types/filters';

const SORT_OPTIONS = [
  { id: 'default', label: 'پیش‌فرض'              },
  { id: 'popular', label: 'محبوب‌ترین'            },
  { id: 'nearest', label: 'نزدیک‌ترین نوبت آزاد' },
] as const;

type SortId = typeof SORT_OPTIONS[number]['id'];

// 🧭 Sort + filter toolbar. Lives OUTSIDE the data <Suspense> so it stays mounted
//    and never blinks on refresh — sort/filters are URL state, not DB content. 🔒
export default function DoctorToolbar({ cityGroup }: { cityGroup?: FilterConfig }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  // 🪶 isPending unused here (cards own the dim state) → discard it
  const [, startTransition]             = useTransition();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen,   setIsSortOpen]   = useState(false);

  const activeSort = (searchParams.get('sort') ?? 'default') as SortId;

  // 🔃 Update sort param and reset to page 1
  const setSort = (id: SortId) => {
    const p = new URLSearchParams(searchParams);
    p.set('sort', id);
    p.delete('page');
    startTransition(() => router.push(`?${p.toString()}`, { scroll: false }));
  };

  return (
    <>
      {/* 💻 Desktop sort bar */}
      <div className="hidden md:flex items-center gap-x-4 px-3 h-16 bg-white border border-neutral-100 rounded-xl">
        <span className="text-sm text-black">مرتب‌سازی بر اساس:</span>
        <div className="flex gap-x-4">
          {SORT_OPTIONS.map(o => (
            <Button
              key={o.id}
              variant="ghost"
              size="sm"
              onClick={() => setSort(o.id)}
              className={cn(
                'h-auto p-0 text-sm hover:bg-transparent',
                activeSort === o.id
                  ? 'font-medium text-primary-500'
                  : 'hover:text-primary-600',
              )}
            >
              {o.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 📱 Mobile action bar */}
      <div className="flex md:hidden h-12 items-center justify-center relative">
        <div className="flex w-1/2 justify-center">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-x-2">
                <SlidersHorizontal size={24} color="#262626" />
                <span className="text-sm text-black">فیلترها</span>
              </Button>
            </SheetTrigger>
            <DoctorFiltersSheet
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
              cityGroup={cityGroup}
            />
          </Sheet>
        </div>

        <div className="flex w-1/2 justify-center">
          <SortSheet
            isOpen={isSortOpen}
            onOpenChange={setIsSortOpen}
            activeSort={activeSort}
            onSortChange={setSort}
          />
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-100 -translate-x-1/2" />
      </div>
    </>
  );
}
