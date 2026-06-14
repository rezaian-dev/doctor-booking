"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from '@/lib/utils/cn';
import { toFaDigits } from "@/lib/utils/persian-format";
import { Button } from "@/components/ui/button";

// 🔢 Persian numerals — deterministic (no Intl) so SSR/CSR match; no grouping for page numbers
const toPersian = toFaDigits;

// 📊 Generate page numbers with ellipsis
const getPages = (current: number, total: number): (number | "...")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3)          return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 2)  return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
};

// ⬅️➡️ Prev/next nav button — module-level (stable component, never re-created per render)
function NavBtn({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      size="icon"
      className="size-10 hover:border-primary-400"
    >
      {/* 🔁 RTL: right arrow = previous, left arrow = next */}
      {dir === "prev" ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
    </Button>
  );
}

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export default function Pagination({ totalPages, className = "" }: PaginationProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const current      = Number(searchParams.get("page")) || 1;

  // 📏 Scroll to top after navigation with responsive offset
  const scrollAfterNav = () => {
    if (typeof window === "undefined") return;
    const isMobile    = window.innerWidth <= 768;
    const targetTop   = pathname === "/articles" ? (isMobile ? 80 : 100) : 80;
    requestAnimationFrame(() => window.scrollTo({ top: targetTop, behavior: "smooth" }));
  };

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`?${params.toString()}`, { scroll: false });
    scrollAfterNav();
  };

  const pages = getPages(current, totalPages);

  return (
    <>
      {/* 💻 Desktop */}
      <div className={cn("hidden md:flex items-center justify-center gap-2", className)}>
        <NavBtn dir="prev" disabled={current === 1} onClick={() => goTo(current - 1)} />

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dot-${i}`} className="size-10 flex items-center justify-center text-neutral-400">
              ...
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => goTo(page)}
              variant={current === page ? "default" : "outline"}
              size="icon"
              className={cn(
                "size-10",
                current === page
                  ? "bg-primary-500 hover:bg-primary-600 text-white"
                  : "hover:border-primary-400"
              )}
            >
              {toPersian(page)}
            </Button>
          )
        )}

        <NavBtn dir="next" disabled={current === totalPages} onClick={() => goTo(current + 1)} />
      </div>

      {/* 📱 Mobile */}
      <div className={cn("flex md:hidden items-center justify-between", className)}>
        <Button onClick={() => goTo(current - 1)} disabled={current === 1} variant="outline" size="sm" className="px-4">
          <ChevronRight size={20} />
        </Button>

        <span className="text-sm">صفحه {toPersian(current)} از {toPersian(totalPages)}</span>

        <Button onClick={() => goTo(current + 1)} disabled={current === totalPages} variant="outline" size="sm" className="px-4">
          <ChevronLeft size={20} />
        </Button>
      </div>
    </>
  );
}
