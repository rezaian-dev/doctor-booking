// 🧠 Radix Sheet half of the mobile menu — its own chunk, loaded lazily (ssr:false)
//    only when the menu opens, so heavy Dialog/Sheet primitives stay off the initial
//    payload. Controlled via open/onOpenChange so the trigger never vanishes. 🚀
'use client';

import { useState, type RefObject } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { mutate } from 'swr'; // 🔄 invalidate the shared /api/auth/me cache on logout
import { clearSessionHintClient, notifyAuthChange } from '@/lib/auth/session-hint'; // 🪪 drop hint + flip header live
import {
  Sheet, SheetClose, SheetContent,
  SheetDescription, SheetTitle,
} from '@/components/ui/sheet';
import {
  ChevronLeft, LogOut, LoaderCircle,
  Calendar, Inbox, BellDot, X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { NavItem } from '@/components/layout/header-shell'; // 🔗 Shared nav shape (DRY)
import type { UserData } from '@/types/patient';                 // 🔗 Shared user shape (DRY)

// 🧱 Shared base styles for every drawer row (DRY: used by nav, appointments & inbox links)
const MENU_ITEM_BASE =
  '-mx-3 flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-all duration-200 active:scale-[0.98]';

interface Props {
  navItems:     readonly NavItem[];
  user:         UserData | null;
  unreadCount?: number;
  // 🎛️ Controlled by <MobileMenu> (the hamburger is the external trigger)
  open:          boolean;
  onOpenChange:  (open: boolean) => void;
  triggerRef?:   RefObject<HTMLButtonElement | null>; // ♿ focus returns here on close
}

export default function MobileMenuDrawer({ navItems, user, unreadCount = 0, open, onOpenChange, triggerRef }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim() || 'کاربر'
    : '';
  const initials = user
    ? ((user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '')).toUpperCase() || 'U'
    : '';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      // 🪪 Drop the client hint instantly so the header renders a clean guest right away.
      clearSessionHintClient();
      // 🔄 CLEAR the shared profile cache (not { user: null }) → a cached null would be read as a
      //    guest button on the next login. undefined = "unknown" → next login shows skeleton→avatar. ✨
      await mutate('/api/auth/me', undefined, { revalidate: false });
      // 📣 Notify every mounted header to re-read the cleared hint live.
      notifyAuthChange();
      onOpenChange(false);
      router.push('/'); // 🚀 soft nav only (refresh removed → no flash)
    } catch {
      setIsLoggingOut(false);
    }
  };

  const NavLink = ({ href, label }: NavItem) => {
    const isActive = pathname === href;
    return (
      <SheetClose asChild>
        <Link href={href} aria-current={isActive ? 'page' : undefined}
          className={cn(
            MENU_ITEM_BASE,
            isActive ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-neutral-950 hover:bg-neutral-50',
          )}>
          {label}
          <ChevronLeft color={isActive ? '#2c5be4' : '#000'} size={24} />
        </Link>
      </SheetClose>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-72 flex-col p-0"
        // ♿ Return focus to the hamburger that opened the sheet (no external trigger)
        onCloseAutoFocus={(e) => {
          if (triggerRef?.current) {
            e.preventDefault();
            triggerRef.current.focus();
          }
        }}
      >
        <div className="self-end px-4 pt-5">
          <SheetClose asChild>
            <button className="mb-1 rounded-md" aria-label="Close" type="button">
              <X size={24} color="#000000" />
            </button>
          </SheetClose>
          <SheetTitle className="sr-only">منوی موبایل</SheetTitle>
          <SheetDescription className="sr-only">ناوبری موبایل</SheetDescription>
        </div>

        {user && (
          <div className="mx-4 mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 p-4 shadow-lg shadow-primary-600/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full border-2 border-white/30 overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
                {user.avatar
                  ? <Image src={user.avatar} alt={fullName} width={48} height={48} className="object-cover" />
                  : <span className="text-sm font-bold text-white">{initials}</span>
                }
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{fullName}</p>
                {/* 📞 Phone must render LTR even inside the RTL drawer → use the real `dir` attr
                       (the old `direction-ltr` utility doesn't exist in Tailwind, so it was a no-op) */}
                {user.phone && <p className="text-xs text-white/70 font-medium text-right" dir="ltr">{user.phone}</p>}
              </div>
            </div>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-y-2 overflow-y-auto px-4 pb-4">
          {navItems.map(item => <NavLink key={item.href} {...item} />)}

          {user && (
            <SheetClose asChild>
              <Link href="/appointments" className={cn(
                MENU_ITEM_BASE,
                pathname === '/appointments'
                  ? 'bg-linear-to-l from-secondary-50 to-secondary-100/50 text-secondary-600 shadow-sm'
                  : 'text-neutral-950 hover:bg-neutral-50',
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    pathname === '/appointments' ? 'bg-secondary-600 text-white' : 'bg-neutral-100 text-neutral-600')}>
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <span>لیست نوبت‌ها</span>
                </div>
                <ChevronLeft color={pathname === '/appointments' ? '#479e13' : '#000'} size={24} />
              </Link>
            </SheetClose>
          )}

          {user && (
            <SheetClose asChild>
              <Link href="/inbox" className={cn(
                MENU_ITEM_BASE,
                pathname === '/inbox'
                  ? 'bg-linear-to-l from-violet-50 to-violet-100/50 text-violet-600 shadow-sm'
                  : 'text-neutral-950 hover:bg-neutral-50',
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn('relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    pathname === '/inbox' ? 'bg-violet-600 text-white' : 'bg-neutral-100 text-neutral-600')}>
                    <Inbox className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span>صندوق ورودی</span>
                  {unreadCount > 0 && <BellDot size={14} className="text-red-500 shrink-0 animate-bounce" />}
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">{unreadCount} جدید</span>
                  )}
                </div>
                <ChevronLeft color={pathname === '/inbox' ? '#7c3aed' : '#000'} size={24} />
              </Link>
            </SheetClose>
          )}

          {user && (
            <>
              <div className="my-2 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
              <button onClick={handleLogout} disabled={isLoggingOut} type="button"
                className="-mx-3 flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 active:scale-[0.98] hover:bg-danger-50 disabled:opacity-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-100 text-danger-600">
                    {isLoggingOut ? <LoaderCircle className="h-4.5 w-4.5 animate-spin" /> : <LogOut className="h-4.5 w-4.5" />}
                  </div>
                  <span className="text-sm font-medium text-danger-600">خروج از حساب</span>
                </div>
                <ChevronLeft color="#ec2a2a" size={24} />
              </button>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
