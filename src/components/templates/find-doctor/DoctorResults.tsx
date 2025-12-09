'use client';

import DoctorProfile from '@/components/DoctorProfile';
import { FilterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import DoctorFiltersSheet from './DoctorFiltersSheet';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { FilterFormData } from '@/types/filters';
import SortSheet from './SortSheet';
import Pagination from '@/components/Pagination';
import { usePathname } from 'next/navigation';

// 📋 Static sort options for doctor listing
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
 * 🧑‍⚕️ Main container for displaying doctor search results
 * - Handles sorting (desktop + mobile)
 * - Manages filter/sort sheet visibility
 * - Renders paginated doctor profiles
 */
const DoctorResults = ({ totalPages = 8 }: DoctorResultsProps) => {
  // 🔧 Client-only rendering guard (avoids hydration mismatch)
  const [isClient, setIsClient] = useState(false);
  
  // 🗂️ State for active sorting option
  const [activeSort, setActiveSort] = useState<SortOption>('default');
  
  // 📱 Sheet visibility states
  const [isOpen, setIsOpen] = useState(false);        // Filter sheet
  const [isSortOpen, setIsSortOpen] = useState(false); // Sort sheet
  const pathname = usePathname()

  // ✅ Mark as client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 🎯 Callback when filters are applied
  const handleApplyFilters = (data: FilterFormData) => {
    console.log('✅ Applied Filters:', data);
    setIsOpen(false); // Close filter sheet after apply
  };

  return (
    <div className="space-y-4">
      {/* 💻 Desktop sorting controls */}
      <div className="hidden md:flex items-center gap-x-3 lg:gap-x-4 px-3 lg:px-[13px] h-16 bg-white border border-neutral-100 rounded-[12px]">
        <div className="text-sm lg:text-base text-black">
          مرتب‌سازی بر اساس:
        </div>
        <div className="flex items-center gap-x-3 lg:gap-x-[18px]">
          {SORT_OPTIONS.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveSort(option.id)}
              className={clsx(
                'text-[13px] lg:text-sm transition-colors cursor-pointer',
                activeSort === option.id
                  ? 'font-medium text-primary-500' // ✅ Active state style
                  : 'hover:text-primary-600'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📱 Mobile action bar (filter + sort) */}
      <div className="flex md:hidden h-12 items-center justify-center relative">
        {/* 🔍 Filter button */}
        <div className="flex w-1/2 justify-center">
          {isClient ? (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-x-2"
                  aria-label="Open filter menu"
                >
                  <HugeiconsIcon icon={FilterIcon} size={24} color="#262626" />
                  <span className="text-black text-sm">فیلترها</span>
                </button>
              </SheetTrigger>
              <DoctorFiltersSheet
                onApply={handleApplyFilters}
                setIsOpen={setIsOpen}
                mode={pathname as ("/doctors" | "/find-doctor") }
              />
            </Sheet>
          ) : (
            // 🌀 Fallback during SSR (no interactive sheet)
            <button
              type="button"
              className="flex items-center gap-x-2"
              aria-label="Open filter menu"
            >
              <HugeiconsIcon icon={FilterIcon} size={24} color="#262626" />
              <span className="text-black text-sm">فیلترها</span>
            </button>
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

        {/* ➗ Divider between filter/sort */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-100 -translate-x-1/2" />
      </div>

      {/* 👨‍⚕️ Render doctor cards */}
      <div className="space-y-4 border-b border-neutral-100 pb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <DoctorProfile key={i} mode="find-doctor" />
        ))}
      </div>

      {/* 📄 Pagination controls */}
      <Pagination totalPages={totalPages} className='mt-5 mb-0' />
    </div>
  );
};

export default DoctorResults;