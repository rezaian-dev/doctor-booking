"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Props {
  bio?:       string;
  title?:     string;
  className?: string;
}

const COLLAPSED_H = 20 * 3; // line-height × visible-lines = 60px

export default function BioSection({ bio = "", title = "", className }: Props) {
  const textRef                     = useRef<HTMLParagraphElement>(null);
  const [isClamped,  setIsClamped]  = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 📏 Measure full height after fonts load to decide whether the clamp is needed
  useEffect(() => {
    const check = () => {
      const el = textRef.current;
      if (!el) return;
      el.style.webkitLineClamp = 'unset';
      el.style.display         = 'block';
      const full               = el.scrollHeight;
      el.style.webkitLineClamp = '';
      el.style.display         = '';
      setIsClamped(full > COLLAPSED_H + 4);
    };
    check();
    document.fonts?.ready.then(check);
  }, [bio]);

  const toggle = useCallback(() => setIsExpanded(p => !p), []);

  return (
    <div className={cn(
      // 🧱 relative → anchors the toggle that straddles the card's bottom edge
      'relative px-3 pt-3 sm:px-4 lg:px-5 lg:pt-5 border border-neutral-100 md:border-none md:rounded-none rounded-[10px]',
      isClamped ? 'pb-9' : 'pb-3 lg:pb-5', // 📐 extra bottom room only when the toggle is shown
      className
    )}>
      <h4 className="text-lg text-black font-medium mb-2">درباره {title}</h4>

      {/* 📝 Bio text — relative wrapper so the fade hugs the paragraph, not the card edge */}
      <div className="relative">
        <p ref={textRef} className={cn('text-neutral-700 text-[13px] leading-5 transition-all duration-300 ease-in-out', !isExpanded && 'line-clamp-3')}>
          {bio}
        </p>

        {/* 🌫️ Soft fade hint while collapsed — sits over the last line, never overlaps the toggle */}
        {isClamped && !isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-white to-transparent" />
        )}
      </div>

      {/* ⬇️ Circular outlined toggle — straddles the card's bottom border, rotates 180° when open ✨ */}
      {isClamped && (
        <Button
          onClick={toggle}
          variant="outline"
          size="icon"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "بستن توضیحات" : "مشاهده بیشتر"}
          className="absolute bottom-0 left-1/2 z-10 size-9 -translate-x-1/2 translate-y-1/2 rounded-full text-neutral-400 shadow-sm hover:text-neutral-600"
        >
          <ChevronDown
            size={18}
            className={cn('transition-transform duration-300 ease-in-out', isExpanded && 'rotate-180')}
          />
        </Button>
      )}
    </div>
  );
}
