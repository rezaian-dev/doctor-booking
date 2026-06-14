'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';
import { formatFaNumber } from '@/lib/utils/persian-format';
import { useFilterParams } from '@/hooks/use-filter-params';
import { DOCTOR_FILTERS } from '@/lib/constants/filters';
import { countActiveFilters } from '@/lib/utils/filter-count';
import type { FilterConfig } from '@/types/filters';
import FilterFields from './filter-fields';

interface Props {
  isOpen:    boolean;
  setIsOpen: (open: boolean) => void;
  cityGroup?: FilterConfig | undefined; // 🏙️ DB-sourced city group, injected from the server page
}

// 📱 Mobile filter sheet — same FilterFields body as desktop, sheet chrome around it
export default function DoctorFiltersSheet({ setIsOpen, cityGroup }: Props) {
  const { draft, setPatch, setArrayField, apply, reset, canApply, canReset } = useFilterParams();
  const [openId, setOpenId] = useState('');
  const activeCount = countActiveFilters(draft); // 🔢 selected across groups + gender

  const handleReset = () => { reset(); setOpenId(''); };
  const handleApply = () => { apply(); setIsOpen(false); };

  return (
    <SheetContent side="right" className="max-w-90 p-0 sm:max-w-85">
      <div className="flex h-full flex-col">

        {/* 🧭 Header */}
        <SheetHeader className="relative border-b border-neutral-100 px-5 py-4">
          <SheetTitle className="flex items-center justify-center gap-2 text-lg font-semibold">
            <SlidersHorizontal size={20} />
            <span>فیلترها</span>
            {activeCount > 0 && (
              <Badge className="h-5 min-w-5 justify-center px-1.5">{formatFaNumber(activeCount)}</Badge>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">تنظیم فیلترهای جستجو برای پیدا کردن پزشک</SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="بستن"
              className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-500">
              <X size={20} />
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* 📋 Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <FilterFields
            showSearch
            groups={DOCTOR_FILTERS}
            cityGroup={cityGroup}
            draft={draft}
            setPatch={setPatch}
            setArrayField={setArrayField}
            openId={openId}
            setOpenId={setOpenId}
          />
        </div>

        {/* 📌 Footer */}
        <SheetFooter className="border-t border-neutral-100 p-5">
          <div className="flex w-full items-center gap-3">
            <Button type="button" onClick={handleReset} disabled={!canReset} variant="outline"
              className={cn('h-11 flex-1 rounded-xl text-sm', !canReset && 'cursor-not-allowed text-neutral-400')}>
              حذف همه
            </Button>
            <Button type="button" onClick={handleApply} disabled={!canApply}
              className={cn('h-11 flex-1 rounded-xl text-sm transition-colors',
                canApply ? 'bg-primary-500 hover:bg-primary-600' : 'cursor-not-allowed bg-primary-100')}>
              اعمال فیلتر
            </Button>
          </div>
        </SheetFooter>
      </div>
    </SheetContent>
  );
}
