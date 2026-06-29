"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface Props {
  text:          string;
  clampLines?:   2 | 3;   // 👁️ visible lines while collapsed (default 3)
  className?:    string;  // 🎨 styling for the <p> itself
  lineHeightPx?: number;  // 📏 line-height used to detect overflow (default 20 = leading-5)
}

// 📖 Clamp long text to N lines with a «مشاهده بیشتر / کمتر» toggle + rotating arrow — the same
//    affordance as the «درباره دکتر» (BioSection) so the whole profile feels consistent. The
//    toggle only appears when the text actually overflows the clamp → no pointless buttons. ✨
export default function ExpandableText({ text, clampLines = 3, className, lineHeightPx = 20 }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  // 📏 After fonts load, measure the un-clamped height to decide whether a toggle is needed
  useEffect(() => {
    const check = () => {
      const el = ref.current;
      if (!el) return;
      el.style.webkitLineClamp = "unset";
      el.style.display         = "block";
      const full               = el.scrollHeight;
      el.style.webkitLineClamp = "";
      el.style.display         = "";
      setIsClamped(full > lineHeightPx * clampLines + 4);
    };
    check();
    document.fonts?.ready.then(check); // 🔤 re-check once webfonts settle (heights shift)
  }, [text, clampLines, lineHeightPx]);

  return (
    <div>
      <p
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-in-out",
          !expanded && (clampLines === 2 ? "line-clamp-2" : "line-clamp-3"),
          className,
        )}
      >
        {text}
      </p>

      {/* ⬇️ Label + rotating chevron, only when the text is genuinely clamped */}
      {isClamped && (
        <Button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          variant="ghost"
          size="sm"
          aria-expanded={expanded}
          className="mt-1 h-7 gap-1 rounded-full px-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700"
        >
          {expanded ? "مشاهده کمتر" : "مشاهده بیشتر"}
          <ChevronDown size={15} className={cn("transition-transform duration-300 ease-in-out", expanded && "rotate-180")} />
        </Button>
      )}
    </div>
  );
}
