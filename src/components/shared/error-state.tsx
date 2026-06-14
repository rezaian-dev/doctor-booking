"use client";

// ⚠️ Shared visual for App Router segment error boundaries.
//    Thin error.tsx files delegate here so the look stays consistent. 🎯
import { useEffect } from "react";
import { RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  error: Error & { digest?: string }; // 🧾 digest is set by Next in production
  reset: () => void; // 🔄 re-renders the failed segment
  title?: string;
  description?: string;
  showHome?: boolean; // 🏠 offer a "back home" escape hatch
  scope?: string; // 🏷️ label for log lines (e.g. "Admin")
};

export function ErrorState({
  error,
  reset,
  title = "مشکلی پیش آمد",
  description = "خطایی غیرمنتظره رخ داد. می‌توانید دوباره تلاش کنید.",
  showHome = true,
  scope = "App",
}: ErrorStateProps) {
  // 📋 Keep the error traceable in logs/observability
  useEffect(() => {
    console.error(`[${scope}Error]`, error);
  }, [error, scope]);

  return (
    <main
      role="alert"
      className="flex min-h-[60vh] w-full items-center justify-center px-4 py-12"
    >
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-danger-50 text-danger-500">
          <RotateCw className="size-7" aria-hidden />
        </span>

        <h1 className="mb-2 text-xl font-semibold text-neutral-900">{title}</h1>
        <p className="mb-6 leading-relaxed text-neutral-600">{description}</p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>
            <RotateCw className="size-4" aria-hidden />
            تلاش مجدد
          </Button>
          {showHome && (
            <Button asChild variant="outline">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- deliberate: a full reload is the most robust recovery from an error boundary */}
              <a href="/">
                <Home className="size-4" aria-hidden />
                صفحه اصلی
              </a>
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
