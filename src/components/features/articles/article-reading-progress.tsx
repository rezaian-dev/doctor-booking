"use client";

import { useEffect, useState } from "react";

/**
 * 📊 ReadingProgress — slim fixed bar showing how far the reader has scrolled.
 *    Pure scroll math (no deps); rAF-throttled so it stays cheap on long pages.
 */
export default function ArticleReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct))); // 🔒 clamp 0–100
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update); // 🪶 throttle to one paint
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.75 bg-transparent"
      role="progressbar"
      aria-label="پیشرفت مطالعه"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 🌈 Fill — RTL bar grows from the right edge */}
      <div
        className="h-full bg-linear-to-l from-primary-500 to-secondary-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
