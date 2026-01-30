'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CancelSquareIcon,
  CheckmarkCircle02Icon,
  Sorting01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import React from 'react';

// 📋 Define static sort options for type safety
const SORT_OPTIONS = [
  { id: 'default', label: 'پیش‌فرض' },
  { id: 'popular', label: 'محبوب‌ترین' },
  { id: 'nearest', label: 'نزدیک‌ترین نوبت آزاد' },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]['id'];

interface SortSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeSort: SortOption;
  onSortChange: (sortId: SortOption) => void;
}

/**
 * 🗂️ SortSheet – Bottom sheet for sorting doctor results
 * ✅ Using Shadcn Button | ✅ Accessible | ✅ RTL-ready
 */
const SortSheet: React.FC<SortSheetProps> = ({
  isOpen,
  onOpenChange,
  activeSort,
  onSortChange,
}) => {
  // 🎯 Handle sort option selection
  const handleSortSelect = (sortId: SortOption) => {
    onSortChange(sortId);
    onOpenChange(false); // ✅ Close sheet after selection
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-x-2">
          <HugeiconsIcon icon={Sorting01Icon} size={24} color="#262626" />
          <span className="text-black text-sm">مرتب‌سازی</span>
        </Button>
      </SheetTrigger>

      {/* 🗂️ Sort Sheet Content */}
      <SheetContent side="bottom" className="p-0 rounded-t-2xl">
        <SheetTitle className="sr-only">مرتب‌سازی نتایج</SheetTitle>
        <SheetDescription className="sr-only">
          انتخاب نحوه مرتب‌سازی لیست پزشکان
        </SheetDescription>

        <div className="px-4 pb-6">
          {/* 🚫 Close button at top */}
          <div className="w-full relative flex h-14 items-center justify-center">
            <span className="font-medium text-base text-black">
              مرتب سازی براساس
            </span>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 text-neutral-500 hover:text-neutral-700"
                aria-label="بستن منوی مرتب‌سازی"
              >
                <HugeiconsIcon icon={CancelSquareIcon} size={24} />
              </Button>
            </SheetClose>
          </div>

          {/* 📋 Sort options list */}
          <div className="py-4">
            {SORT_OPTIONS.map(option => (
              <div
                key={option.id}
                className={clsx(
                  'py-4 flex cursor-pointer items-center justify-between',
                  option.id !== 'nearest' && 'border-b border-neutral-100'
                )}
                onClick={() => handleSortSelect(option.id)}
              >
                <span
                  className={clsx(
                    'font-medium text-[15px]',
                    activeSort === option.id
                      ? 'text-primary-500'
                      : 'text-neutral-700'
                  )}
                >
                  {option.label}
                </span>
                {activeSort === option.id && (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={24}
                    color="#4179F0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SortSheet;
