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

  // 📏 Measure full height after fonts load to determine if clamp is needed
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
      'p-3 sm:px-4 lg:p-5 border border-neutral-100 md:border-none md:rounded-none rounded-[10px] relative',
      isClamped && !isExpanded && 'pb-8',
      className
    )}>
      <h4 className="text-lg text-black font-medium mb-2">درباره {title}</h4>

      <p ref={textRef} className={cn('text-neutral-700 text-[13px] leading-5 transition-all duration-300 ease-in-out', !isExpanded && 'line-clamp-3')}>
        {bio}
      </p>

      {isClamped && (
        <>
          {/* 🌫️ Fade overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute bottom-7 left-0 right-0 h-10 bg-linear-to-t from-white to-transparent pointer-events-none rounded-b-[10px]" />
          )}

          <Button
            onClick={toggle}
            variant="ghost"
            size="icon"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'مشاهده کمتر' : 'مشاهده بیشتر'}
            className="absolute -bottom-4 left-0 right-0 mx-auto w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-40 p-0"
          >
            {/* ⬇️ Rotates 180° when expanded */}
            <ChevronDown
              size={20}
              color="#6D6D6D"
              className={cn('transition-transform duration-300 ease-in-out', isExpanded && 'rotate-180')}
            />
          </Button>
        </>
      )}
    </div>
  );
}
