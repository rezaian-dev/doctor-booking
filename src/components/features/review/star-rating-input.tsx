'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label }  from '@/components/ui/label';
import { Star }   from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const RATING_TEXT:  Record<number, string> = { 5:'عالی', 4:'خیلی خوب', 3:'خوب', 2:'متوسط', 1:'ضعیف' };
const RATING_EMOJI: Record<number, string> = { 5:'🌟', 4:'😊', 3:'🙂', 2:'😐', 1:'😞' };
const STARS = [1, 2, 3, 4, 5] as const;

interface Props { value: number; onRate: (r: number) => void; error?: string | undefined; }

const StarRatingInput = ({ value, onRate, error }: Props) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm sm:text-base font-bold text-neutral-900">
        امتیاز شما <span className="text-primary-500">*</span>
      </Label>

      {/* ⭐ Star buttons */}
      <div className="flex justify-center gap-2 sm:gap-3 py-2 sm:py-3 md:py-4">
        {STARS.map(s => (
          <Button
            key={s}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRate(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="h-auto w-auto p-0 hover:bg-transparent transition-transform hover:scale-110 sm:hover:scale-125 active:scale-95"
          >
            <Star className={cn(
              'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all duration-300',
              s <= active ? 'text-alert fill-alert drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]' : 'text-neutral-200'
            )} />
          </Button>
        ))}
      </div>

      {/* 🏷️ Rating label */}
      <div className="h-10 sm:h-11 md:h-12 flex items-center justify-center">
        <span className={cn(
          'inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary-100 rounded-full text-secondary-700 font-semibold text-sm sm:text-base transition-all duration-500',
          value > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}>
          <span className="text-base sm:text-lg md:text-xl">{RATING_EMOJI[value]}</span>
          {RATING_TEXT[value]}
        </span>
      </div>

      {/* ⚠️ Validation error */}
      {/* ⚠️ Reserved slot — opacity, no layout shift */}
      <p
        role="alert"
        aria-live="polite"
        className="h-5 text-xs text-danger-500 text-center transition-opacity duration-200"
        style={{ opacity: error ? 1 : 0 }}
      >
        {error ?? '‌'}
      </p>
    </div>
  );
};

export default StarRatingInput;
