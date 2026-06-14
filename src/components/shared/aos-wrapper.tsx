"use client";

// 🎬 Thin client boundary that forwards data-aos-* to a wrapper element, so Server
//    Components can trigger AOS animations without a hydration mismatch.

interface AosWrapperProps {
  children: React.ReactNode;
  animation?: string;        // e.g. "fade-up", "fade-right", "zoom-in"
  delay?: number;            // ms delay (0 | 100 | 200 | …)
  duration?: number;         // ms duration override (overrides global)
  as?: "div" | "section" | "article" | "li" | "span";
  className?: string;
  anchor?: string;           // data-aos-anchor
}

export default function AosWrapper({
  children,
  animation = "fade-up",
  delay,
  duration,
  as: Tag = "div",
  className,
  anchor,
}: AosWrapperProps) {
  return (
    <Tag
      className={className}
      data-aos={animation}
      {...(delay    !== undefined ? { "data-aos-delay":    String(delay)    } : {})}
      {...(duration !== undefined ? { "data-aos-duration": String(duration) } : {})}
      {...(anchor   !== undefined ? { "data-aos-anchor":   anchor           } : {})}
      suppressHydrationWarning
    >
      {children}
    </Tag>
  );
}
