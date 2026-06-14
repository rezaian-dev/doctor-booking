"use client";

import { useEffect, useRef, useState } from "react";
import { toFaDigits } from "@/lib/utils/persian-format";

interface CountUpProps {
  value:       number;  // 🎯 final number to count to
  durationMs?: number;  // ⏱️ animation length
  className?:  string;
}

/**
 * 🔢 CountUp — animates 0 → value when it scrolls into view (easeOutCubic).
 *    SSR/no-JS renders the real number (good for SEO/a11y); on the client it resets
 *    to 0 and counts up the first time it enters the viewport. Honors prefers-reduced-motion.
 *    🧠 All setState happens inside IO/rAF callbacks (never synchronously in the effect body),
 *    so it can't trigger cascading renders.
 */
export default function CountUp({ value, durationMs = 1300, className }: CountUpProps) {
  // 🌱 Start at the real value so server-rendered HTML is correct
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ♿ Read motion preference once (a read, not a state update)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let done = false;

    const animate = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3); // 📈 easeOutCubic
        setDisplay(Math.round(eased * value));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // 👀 Trigger once when at least 40% of the element is visible.
    //    setState lives in this callback → external-event driven, not effect-body sync.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !done) {
          done = true;
          if (reduce) {
            setDisplay(value);   // 🏁 jump straight to the final number
          } else {
            setDisplay(0);       // 🔄 reset, then count up
            animate();
          }
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return <span ref={ref} className={className}>{toFaDigits(display)}</span>;
}
