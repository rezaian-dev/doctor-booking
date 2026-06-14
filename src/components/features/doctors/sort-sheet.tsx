'use client';

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ArrowUpDown, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

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

const SortSheet = ({
  isOpen,
  onOpenChange,
  activeSort,
  onSortChange,
}: SortSheetProps) => {
  const handleSortSelect = (sortId: SortOption) => {
    onSortChange(sortId);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-x-2">
          <ArrowUpDown size={20} color="#262626" />
          <span className="text-black text-sm">مرتب‌سازی</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="p-0 rounded-t-2xl">
        <SheetTitle className="sr-only">مرتب‌سازی نتایج</SheetTitle>
        <SheetDescription className="sr-only">
          انتخاب نحوه مرتب‌سازی لیست پزشکان
        </SheetDescription>

        <div className="px-4 pb-6">
          <div className="w-full relative flex h-14 items-center justify-center">
            <span className="font-medium text-base text-black">مرتب سازی براساس</span>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 text-neutral-500 hover:text-neutral-700"
                aria-label="بستن منوی مرتب‌سازی"
              >
                <X size={20} />
              </Button>
            </SheetClose>
          </div>

          <div className="py-4">
            {SORT_OPTIONS.map(option => (
              <div
                key={option.id}
                className={cn(
                  'py-4 flex cursor-pointer items-center justify-between',
                  option.id !== 'nearest' && 'border-b border-neutral-100'
                )}
                onClick={() => handleSortSelect(option.id)}
              >
                <span
                  className={cn(
                    'font-medium text-[15px]',
                    activeSort === option.id ? 'text-primary-500' : 'text-neutral-700'
                  )}
                >
                  {option.label}
                </span>
                {activeSort === option.id && (
                  <CheckCircle2 size={22} color="#4179F0" />
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
