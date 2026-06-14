'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { Check, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  type:     'recommend' | 'not-recommend';
  selected: boolean;
  onClick:  () => void;
}

// 🎨 Fully static class sets per variant — Tailwind can't generate classes built via
//    string interpolation (`bg-${color}-500`), so every utility is written out in full. ✨
const VARIANTS = {
  recommend: {
    Icon: ThumbsUp,
    card: 'border-secondary-400 bg-linear-to-br from-secondary-50 to-secondary-100 shadow-lg shadow-secondary-200/50 scale-105 hover:bg-linear-to-br hover:from-secondary-50 hover:to-secondary-100',
    chip: 'bg-secondary-100 group-hover:bg-secondary-200',
    chipOn: 'bg-secondary-500',
    iconOff: 'text-secondary-600',
    label: 'پیشنهاد می‌کنم',
    labelOn: 'text-secondary-700',
    badge: 'bg-secondary-500',
  },
  'not-recommend': {
    Icon: ThumbsDown,
    card: 'border-danger-400 bg-linear-to-br from-danger-50 to-danger-100 shadow-lg shadow-danger-200/50 scale-105 hover:bg-linear-to-br hover:from-danger-50 hover:to-danger-100',
    chip: 'bg-danger-100 group-hover:bg-danger-200',
    chipOn: 'bg-danger-500',
    iconOff: 'text-danger-600',
    label: 'پیشنهاد نمی‌کنم',
    labelOn: 'text-danger-700',
    badge: 'bg-danger-500',
  },
} as const;

const RecommendButton = ({ type, selected, onClick }: Props) => {
  const v = VARIANTS[type];

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className={cn(
        'relative h-auto p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 group',
        selected
          ? v.card
          : 'border-neutral-150 bg-neutral-30 hover:border-neutral-200 hover:shadow-md hover:bg-neutral-30'
      )}
    >
      {/* 🎨 Icon circle */}
      <div className={cn('p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300', selected ? v.chipOn : v.chip)}>
        <v.Icon className={cn(
          'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300',
          selected ? 'text-neutral-30 scale-110' : v.iconOff
        )} />
      </div>

      {/* 🏷️ Label */}
      <span className={cn(
        'text-xs sm:text-sm md:text-base font-bold transition-colors text-center',
        selected ? v.labelOn : 'text-neutral-700'
      )}>
        {v.label}
      </span>

      {/* ✅ Selected badge */}
      {selected && (
        <div className={cn(
          'absolute top-2 sm:top-3 left-2 sm:left-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center',
          v.badge
        )}>
          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-30" strokeWidth={3} />
        </div>
      )}
    </Button>
  );
};

export default RecommendButton;
