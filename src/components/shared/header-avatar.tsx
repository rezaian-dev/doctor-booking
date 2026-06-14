// 🖼️ Header avatar that shows a shimmer skeleton until the photo actually paints,
//    so on slow connections the user never sees an empty circle pop into a face. 🧠
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface Props {
  src?: string | null; // 🌐 CDN avatar URL (falls back to initials when absent)
  alt: string;
  initials: string;
  className?: string; // 📐 size/ring overrides for the wrapper
}

export function HeaderAvatar({ src, alt, initials, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  // ✅ A cached image can finish before React wires up onLoad → read .complete once
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={cn(
        "relative h-9 w-9 overflow-hidden rounded-full bg-primary-100 ring-2 ring-primary-100 flex items-center justify-center",
        className,
      )}
    >
      {src ? (
        <>
          <Image
            ref={ref}
            src={src}
            alt={alt}
            fill
            sizes="36px"
            priority
            onLoad={() => setLoaded(true)}
            className={cn("object-cover transition-opacity duration-300", loaded ? "opacity-100" : "opacity-0")}
          />
          {/* 💀 Shimmer placeholder — visible only until the photo paints */}
          {!loaded && <span aria-hidden className="absolute inset-0 animate-pulse bg-neutral-200" />}
        </>
      ) : (
        <span className="text-xs font-bold text-primary-700">{initials}</span>
      )}
    </div>
  );
}
