"use client"
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';

// 🔢 Convert to Persian
const toPersian = (num: number) => num.toLocaleString('fa-IR');

// 📊 Generate pages
const getPages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 2) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};

interface PaginationProps {
  totalPages: number;
  className?: string;
}

export default function Pagination({ totalPages, className = '' }: PaginationProps) {
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
  const targetPosition = pathname === '/articles'
    ? (isMobile ? 80 : 100)  // 📱 Mobile: 100px | 💻 Desktop: 500px
    : 80;                    // 🌐 All other routes

  // ✨ Smooth scroll with frame sync
  requestAnimationFrame(() => {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
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
  const btnBase = 'flex items-center justify-center rounded-lg transition-colors';
  const btnDisabled = 'disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <>
      {/* Desktop */}
      <div className={clsx('hidden md:flex items-center justify-center gap-2', className)}>
        <button onClick={() => goTo(current - 1)} disabled={current === 1} className={clsx(btnBase, 'hover:border-primary-400 size-10 border cursor-pointer border-neutral-200 hover:bg-neutral-50', btnDisabled)}>
          <svg width="20" height="20" className="rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dot-${i}`} className="size-10 flex items-center justify-center text-neutral-400">...</span>
          ) : (
            <button key={page} onClick={() => goTo(page as number)} className={clsx(btnBase, 'size-10 cursor-pointer', current === page ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'border hover:border-primary-400 cursor-pointer border-neutral-200 hover:bg-neutral-50')}>
              {toPersian(page as number)}
            </button>
          )
        )}

        <button onClick={() => goTo(current + 1)} disabled={current === totalPages} className={clsx(btnBase, 'cursor-pointer hover:border-primary-400 size-10 border border-neutral-200 hover:bg-neutral-50', btnDisabled)}>
          <svg width="20" height="20" className="rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Mobile */}
      <div className={clsx('flex md:hidden items-center justify-between', className)}>
        <button onClick={() => goTo(current - 1)} disabled={current === 1} className={clsx(btnBase, 'px-4 py-2 border border-neutral-200 hover:bg-neutral-50', btnDisabled)}>
          <svg width="20" height="20" className="rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="text-sm">صفحه {toPersian(current)} از {toPersian(totalPages)}</div>

        <button onClick={() => goTo(current + 1)} disabled={current === totalPages} className={clsx(btnBase,'px-4 py-2 border border-neutral-200 hover:bg-neutral-50', btnDisabled)}>
          <svg width="20" height="20" className="rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  );
}
