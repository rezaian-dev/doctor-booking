'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { formatFaNumber } from '@/lib/utils/persian-format';
import { useFilterParams } from '@/hooks/use-filter-params';
import { DOCTOR_FILTERS } from '@/lib/constants/filters';
import { countActiveFilters } from '@/lib/utils/filter-count';
import type { FilterConfig } from '@/types/filters';
import FilterFields from './filter-fields';

// 🏙️ cityGroup is fetched server-side and injected (optional → graceful if missing)
interface Props { cityGroup?: FilterConfig }

// 🖥️ Desktop filter card — header w/ active count + sticky apply bar
export default function DoctorFilters({ cityGroup }: Props) {
  const { draft, setPatch, setArrayField, apply, reset, canApply, canReset } = useFilterParams();
  const [openId, setOpenId] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const activeCount = countActiveFilters(draft); // 🔢 selected across groups + gender

  // 🖱️ Click outside collapses the open accordion section
  const closeOnOutsideClick = useCallback((e: PointerEvent) => {
    if (!panelRef.current?.contains(e.target as Node)) setOpenId('');
  }, []);

  useEffect(() => {
    if (!openId) return;
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [openId, closeOnOutsideClick]);

  const handleReset = () => { reset(); setOpenId(''); };

  return (
    <div
      ref={panelRef}
      className="hidden overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm md:block"
    >
      {/* 🧭 Header */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-neutral-700" />
          <h3 className="text-base font-semibold text-neutral-900">فیلترها</h3>
          {activeCount > 0 && (
            <Badge className="h-5 min-w-5 justify-center px-1.5">{formatFaNumber(activeCount)}</Badge>
          )}
        </div>
        <Button
          type="button"
          onClick={handleReset}
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-1 px-2 text-xs text-primary-600 transition-opacity hover:bg-primary-50 hover:text-primary-700',
            canReset ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          حذف همه
          <X size={14} />
        </Button>
      </div>

      {/* 📋 Body */}
      <div className="p-5">
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

      {/* 📌 Sticky apply bar */}
      <div className="sticky bottom-0 border-t border-neutral-100 bg-white/95 px-5 py-4 backdrop-blur">
        <Button
          type="button"
          onClick={apply}
          disabled={!canApply}
          className={cn(
            'h-11 w-full rounded-xl transition-colors',
            canApply ? 'bg-primary-500 hover:bg-primary-700' : 'cursor-not-allowed bg-primary-100',
          )}
        >
          اعمال فیلتر
        </Button>
      </div>
    </div>
  );
}
