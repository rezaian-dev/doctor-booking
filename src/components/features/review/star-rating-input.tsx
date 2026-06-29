'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Star }   from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const RATING_TEXT:  Record<number, string> = { 5:'عالی', 4:'خیلی خوب', 3:'خوب', 2:'متوسط', 1:'ضعیف' };
const RATING_EMOJI: Record<number, string> = { 5:'🌟', 4:'😊', 3:'🙂', 2:'😐', 1:'😞' };
const STARS = [1, 2, 3, 4, 5] as const;

interface Props { value: number; onRate: (r: number) => void; error?: string | undefined; }

// ⭐ Stars + animated rating chip (the section title lives in the parent for one clean header)
const StarRatingInput = ({ value, onRate, error }: Props) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="space-y-1">
      {/* ⭐ Star buttons */}
      <div className="flex justify-center gap-2 sm:gap-3 py-1 sm:py-2">
        {STARS.map(s => (
          <Button
            key={s}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${s} ستاره`}
            onClick={() => onRate(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="h-auto w-auto p-0 hover:bg-transparent transition-transform hover:scale-110 sm:hover:scale-125 active:scale-95"
          >
            <Star className={cn(
              'w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 transition-all duration-300',
              s <= active ? 'text-alert fill-alert drop-shadow-[0_0_8px_rgba(255,184,0,0.45)]' : 'text-neutral-200'
            )} />
          </Button>
        ))}
      </div>

      {/* 🏷️ Rating label chip */}
      <div className="h-8 sm:h-9 flex items-center justify-center">
        <span className={cn(
          'inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-secondary-100 rounded-full text-secondary-700 font-semibold text-xs sm:text-sm transition-all duration-500',
          value > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}>
          <span className="text-base sm:text-lg">{RATING_EMOJI[value]}</span>
          {RATING_TEXT[value]}
        </span>
      </div>

      {/* ⚠️ Reserved error slot — opacity, no layout shift */}
      <p
        role="alert"
        aria-live="polite"
        className="h-4 text-xs text-danger-500 text-center transition-opacity duration-200"
        style={{ opacity: error ? 1 : 0 }}
      >
        {error ?? '‌'}
      </p>
    </div>
  );
};

export default StarRatingInput;
