// 🧠 Client mobile header chrome. user/unreadCount arrive as props (avatar in SSR HTML,
//    no flash). ✨ Hamburger is always a plain <button> so it can't vanish; the heavy
//    Radix Sheet drawer loads only when the menu opens → tiny initial payload. 🚀
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu } from 'lucide-react';
import { HeaderAvatar } from '@/components/shared/header-avatar';
import type { NavItem } from '@/components/layout/header-shell'; // 🔗 Shared nav shape (DRY)
import type { UserData } from '@/types/patient';                 // 🔗 Shared user shape (DRY)

// 💤 Radix Sheet drawer — its own chunk, fetched ON DEMAND (first menu open only)
const MobileMenuDrawer = dynamic(() => import('@/components/shared/mobile-menu-drawer'), {
  ssr: false,
});

interface Props {
  navItems:     readonly NavItem[];
  // 🔑 Server passes these as props — no client fetch needed
  user:         UserData | null;
  unreadCount?: number;
  // ⏳ True only while a LOGGED-IN user's profile resolves (static page → /api/auth/me)
  isAuthLoading?: boolean;
  // 👻 True on SSR + first paint, before the session hint is read → render an empty slot
  //    so guests never flash a skeleton or a login button on refresh. 🧠
  sessionPending?: boolean;
}

export function MobileMenu({ navItems, user, unreadCount = 0, isAuthLoading = false, sessionPending = false }: Props) {
  const [open, setOpen]               = useState(false);
  const [drawerMounted, setDrawerMnt] = useState(false); // 📦 mount drawer chunk lazily
  const triggerRef = useRef<HTMLButtonElement>(null);    // ♿ restore focus on close

  // 🎛️ First interaction loads the chunk AND opens the sheet
  const openMenu = () => {
    setDrawerMnt(true);
    setOpen(true);
  };

  const initials = user
    ? ((user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '')).toUpperCase() || 'U'
    : '';

  return (
    <>
      {/* 🎛️ HAMBURGER — always a plain button (identical on SSR + client, never
          swapped) so it can never flicker/disappear during hydration or chunk load. */}
      <button
        ref={triggerRef}
        className="md:hidden"
        aria-label="باز کردن منو"
        aria-haspopup="dialog"
        aria-expanded={open}
        type="button"
        onClick={openMenu}
      >
        <Menu size={24} color="#262626" />
      </button>

      {/* 🏠 Logo */}
      <Link href="/" className="flex items-center gap-x-2" aria-label="صفحه اصلی">
        <img src="/images/logo.jpg" alt="دکتر رزرو" width={32} height={32} className="size-6 sm:size-8" />
        <span className="text-lg font-medium">دکتر <span className="text-primary-600">رزرو</span></span>
      </Link>

      {/* 👤 Fixed-width user slot → the logo NEVER shifts between
          placeholder / skeleton / avatar / login (zero header jump on refresh).
          • pending → empty (hint not read yet → no skeleton, no login flash for guests)
          • loading → 36px circular skeleton (logged-in users only)
          • authed  → avatar (shimmers until its photo paints)
          • guest   → login button
          The slot is sized to fit the widest state (login) and end-aligns its
          content, so every transition is a pure cross-fade in place. 🧠 */}
      <div className="md:hidden flex w-20 shrink-0 items-center justify-end">
        {sessionPending ? (
          <span className="h-9 w-9" aria-hidden />
        ) : isAuthLoading ? (
          <div className="h-9 w-9 rounded-full bg-neutral-200 animate-pulse" aria-hidden />
        ) : user ? (
          <Link href="/profile" className="shrink-0" aria-label="پروفایل">
            <HeaderAvatar src={user.avatar ?? null} alt={user.firstName} initials={initials} />
          </Link>
        ) : (
          <Link href="/auth/login"
            className="rounded-xl bg-linear-to-l from-primary-600 to-primary-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-transform active:scale-95">
            ورود
          </Link>
        )}
      </div>

      {/* 💤 Drawer — mounted only after the first open → its chunk loads on demand */}
      {drawerMounted && (
        <MobileMenuDrawer
          navItems={navItems}
          user={user}
          unreadCount={unreadCount}
          open={open}
          onOpenChange={setOpen}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}
