"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface Props {
  href: string;
  label: string;
}

/**
 * ✨ Desktop nav link with animated active indicator
 * 🟦 Active state: blue underline pill + subtle text color shift
 * 🎯 Uses `usePathname` — must be a Client Component
 */
export function NavActiveLink({ href, label }: Props) {
  const pathname = usePathname();
  // 🔍 Exact match OR sub-path match (e.g. /doctors/[id] highlights /doctors)
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative px-3 py-2 text-sm font-medium rounded-lg",
        "transition-colors duration-200",
        // 🔵 Active: primary color text + light bg pill
        isActive
          ? "text-primary-600 bg-primary-50"
          : "text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
      )}
    >
      {label}

      {/* ✨ Animated underline bar — slides in from center on active */}
      <span
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-primary-500",
          "origin-center transition-all duration-300",
          isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        )}
        aria-hidden="true"
      />
    </Link>
  );
}
