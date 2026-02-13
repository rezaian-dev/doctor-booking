'use client';

import DoctorProfile from '@/components/shared/profile-card';
import { FilterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import DoctorFiltersSheet from './doctor-filters-sheet';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import SortSheet from './sort-sheet';
import Pagination from '@/components/shared/pagination';
import { usePathname } from 'next/navigation';
import { FilterFormData } from '@/types/filters';

// 📋 Static sort options
const SORT_OPTIONS = [
  { id: 'default', label: 'پیش‌فرض' },
  { id: 'popular', label: 'محبوب‌ترین' },
  { id: 'nearest', label: 'نزدیک‌ترین نوبت آزاد' },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]['id'];

interface DoctorResultsProps {
  totalPages?: number;
}

/**
 * 🧑‍⚕️ DoctorResults – Refactored with Shadcn Button
 * ✅ Clean sorting controls | ✅ Type-safe | ✅ Accessible
 */
const DoctorResults = ({ totalPages = 8 }: DoctorResultsProps) => {
  // 🔧 Client-only rendering guard
  const [isClient, setIsClient] = useState(false);

  // 🗂️ State for active sorting option
  const [activeSort, setActiveSort] = useState<SortOption>('default');

  // 📱 Sheet visibility states
  const [isOpen, setIsOpen] = useState(false); // Filter sheet
  const [isSortOpen, setIsSortOpen] = useState(false); // Sort sheet
  const pathname = usePathname();

  // ✅ Mark as client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🎯 Callback when filters are applied
  const handleApplyFilters = (data: FilterFormData) => {
    console.log('✅ Applied Filters:', data);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* 💻 Desktop sorting controls */}
      <div className="hidden md:flex items-center gap-x-3 lg:gap-x-4 px-3 lg:px-3.25 h-16 bg-white border border-neutral-100 rounded-[12px]">
        <div className="text-sm lg:text-base text-black">
          مرتب‌سازی بر اساس:
        </div>
        <div className="flex items-center gap-x-3 lg:gap-x-4.5">
          {SORT_OPTIONS.map(option => (
            <Button
              key={option.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveSort(option.id)}
              className={clsx(
                'text-[13px] lg:text-sm h-auto p-0 hover:bg-transparent',
                activeSort === option.id
                  ? 'font-medium text-primary-500'
                  : 'hover:text-primary-600'
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 📱 Mobile action bar */}
      <div className="flex md:hidden h-12 items-center justify-center relative">
        {/* 🔍 Filter button */}
        <div className="flex w-1/2 justify-center">
          {isClient ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-x-2">
                  <HugeiconsIcon icon={FilterIcon} size={24} color="#262626" />
                  <span className="text-black text-sm">فیلترها</span>
                </Button>
              </SheetTrigger>
              <DoctorFiltersSheet
                onApply={handleApplyFilters}
                setIsOpen={setIsOpen}
                mode={pathname as '/doctors' | '/find-doctor'}
              />
            </Sheet>
          ) : (
            <Button variant="ghost" size="sm" className="gap-x-2">
              <HugeiconsIcon icon={FilterIcon} size={24} color="#262626" />
              <span className="text-black text-sm">فیلترها</span>
            </Button>
          )}
        </div>

        {/* 🔄 Sort button */}
        <div className="flex w-1/2 justify-center">
          {isClient && (
            <SortSheet
              isOpen={isSortOpen}
              onOpenChange={setIsSortOpen}
              activeSort={activeSort}
              onSortChange={setActiveSort}
            />
          )}
        </div>

        {/* ➗ Divider */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-100 -translate-x-1/2" />
      </div>

      {/* 👨‍⚕️ Render doctor cards */}
      <div className="space-y-4 border-b border-neutral-100 pb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <DoctorProfile key={i} mode="find-doctor" />
        ))}
      </div>

      {/* 📄 Pagination */}
      <Pagination totalPages={totalPages} className="mt-5 mb-0" />
    </div>
  );
};

export default DoctorResults;
