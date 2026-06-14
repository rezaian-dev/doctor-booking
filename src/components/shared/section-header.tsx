import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  title: string;
  viewAllHref: string;
  viewAllLabel?: string;
  // 📏 Spacing is a caller concern (carousels want mb-5, the FAQ section spaces itself)
  className?: string;
}

// 🏷️ Shared "Title + مشاهده همه" header for home carousels & FAQ. Kept dependency-light
//    so lazy fallbacks can import it without pulling a heavy chunk. 🧠
export function SectionHeader({ title, viewAllHref, viewAllLabel = "مشاهده همه", className = "mb-5" }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
        {title}
      </h2>
      <div className="flex items-center gap-x-1.5">
        <Link
          href={viewAllHref}
          className="font-medium text-xs sm:text-sm text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap"
        >
          {viewAllLabel}
        </Link>
        <ChevronLeft size={20} className="text-neutral-600" aria-hidden="true" />
      </div>
    </div>
  );
}
