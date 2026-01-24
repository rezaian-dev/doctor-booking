"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { Star } from "lucide-react";
import { useState } from "react";

// 🌟 Rating text and emoji mappings
const ratingText: Record<number, string> = {
  5: 'عالی',
  4: 'خیلی خوب',
  3: 'خوب',
  2: 'متوسط',
  1: 'ضعیف'
};

const ratingEmoji: Record<number, string> = {
  5: '🌟',
  4: '😊',
  3: '🙂',
  2: '😐',
  1: '😞'
};

// 📝 StarRatingInput component props interface
interface StarRatingInputProps {
  value: number;
  onRate: (rating: number) => void;
  error?: string;
}

// ⭐ Star rating INPUT component for review form
const StarRatingInput = ({ value, onRate, error }: StarRatingInputProps) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm sm:text-base font-bold text-neutral-900">
        امتیاز شما <span className="text-primary-500">*</span>
      </Label>
      {/* 🎯 Star rating container with larger responsive sizing */}
      <div className="flex justify-center gap-2 sm:gap-3 py-2 sm:py-3 md:py-4">
        {[1, 2, 3, 4, 5].map(s => (
          <Button
            key={s}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRate(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className={clsx(
              "group relative transition-transform hover:scale-110 sm:hover:scale-125 active:scale-95 h-auto w-auto p-0 hover:bg-transparent"
            )}
          >
            <Star className={clsx(
              'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 transition-all duration-300',
              s <= active
                ? 'text-alert fill-alert drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]'
                : 'text-neutral-200'
            )} />
          </Button>
        ))}
      </div>
      {/* 🔒 Fixed height container to prevent layout shift */}
      <div className="h-10 sm:h-11 md:h-12 flex items-center justify-center">
        <div className={clsx(
          'text-center transition-all duration-500',
          value > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}>
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary-100 rounded-full text-secondary-700 font-semibold text-sm sm:text-base">
            <span className="text-base sm:text-lg md:text-xl">{ratingEmoji[value]}</span>
            {ratingText[value]}
          </span>
        </div>
      </div>
      {/* ⚠️ Fixed height error container */}
      <div className="h-5 sm:h-6">
        {error && (
          <p className="text-xs sm:text-sm text-danger-500 text-center animate-pulse">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default StarRatingInput;
