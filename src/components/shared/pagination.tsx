'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';

// 🔢 Convert to Persian numbers
const toPersian = (num: number) => num.toLocaleString('fa-IR');

// 📊 Generate page numbers with ellipsis
const getPages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 2)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export default function Pagination({
  totalPages,
  className = '',
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = Number(searchParams.get('page')) || 1;

  // 📏 Responsive scroll handler with breakpoints
  const handleScrollAfterNavigation = (pathname: string) => {
    // 🛡️ SSR protection
    if (typeof window === 'undefined') return;

    // 📱 Define responsive breakpoints
    const MOBILE_BREAKPOINT = 768;
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

    // 🎯 Calculate target position based on route and device
    const targetPosition =
      pathname === '/articles' ? (isMobile ? 80 : 100) : 80;

    // ✨ Smooth scroll with frame sync
    requestAnimationFrame(() => {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  };

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`?${params.toString()}`, { scroll: false });
    handleScrollAfterNavigation(pathname);
  };

  const pages = getPages(current, totalPages);

  return (
    <>
      {/* 💻 Desktop Pagination */}
      <div
        className={clsx(
          'hidden md:flex items-center justify-center gap-2',
          className
        )}
      >
        {/* ⬅️ Previous Button */}
        <Button
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
          variant="outline"
          size="icon"
          className="size-10 hover:border-primary-400"
        >
          <svg
            width="20"
            height="20"
            className="rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>

        {/* 🔢 Page Numbers */}
        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`dot-${i}`}
              className="size-10 flex items-center justify-center text-neutral-400"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => goTo(page as number)}
              variant={current === page ? 'default' : 'outline'}
              size="icon"
              className={clsx(
                'size-10',
                current === page
                  ? 'bg-primary-500 hover:bg-primary-600 text-white'
                  : 'hover:border-primary-400'
              )}
            >
              {toPersian(page as number)}
            </Button>
          )
        )}

        {/* ➡️ Next Button */}
        <Button
          onClick={() => goTo(current + 1)}
          disabled={current === totalPages}
          variant="outline"
          size="icon"
          className="size-10 hover:border-primary-400"
        >
          <svg
            width="20"
            height="20"
            className="rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>

      {/* 📱 Mobile Pagination */}
      <div
        className={clsx(
          'flex md:hidden items-center justify-between',
          className
        )}
      >
        {/* ⬅️ Previous Button */}
        <Button
          onClick={() => goTo(current - 1)}
          disabled={current === 1}
          variant="outline"
          size="sm"
          className="px-4"
        >
          <svg
            width="20"
            height="20"
            className="rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Button>

        {/* 📄 Page Info */}
        <div className="text-sm">
          صفحه {toPersian(current)} از {toPersian(totalPages)}
        </div>

        {/* ➡️ Next Button */}
        <Button
          onClick={() => goTo(current + 1)}
          disabled={current === totalPages}
          variant="outline"
          size="sm"
          className="px-4"
        >
          <svg
            width="20"
            height="20"
            className="rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>
    </>
  );
}
