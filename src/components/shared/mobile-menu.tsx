'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { LogOut, Loader2, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/providers/auth-provider';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navItems: readonly NavItem[];
}

export const MobileMenu = ({ navItems }: MobileMenuProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => setIsClient(true), []);

  // 🚪 Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  // 🧠 User display data
  const initials = user
    ? (user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '') || 'U'
    : 'U';
  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'کاربر'
    : 'کاربر';

  return (
    <>
      <div className="flex items-center gap-x-4">
        {/* 🍔 Hamburger menu */}
        {isClient ? (
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden" aria-label="Open menu">
                <HugeiconsIcon icon={Menu01Icon} color="#262626" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-72 flex-col p-0 md:hidden">
              {/* ❌ Close button */}
              <div className="self-end px-4 pt-5">
                <SheetClose asChild>
                  <button className="mb-1 rounded-md" aria-label="Close">
                    <HugeiconsIcon icon={Cancel01Icon} color="#000000" size={24} />
                  </button>
                </SheetClose>
                <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
                <SheetDescription className="sr-only">Navigate sections</SheetDescription>
              </div>

              {/* 👤 User header */}
              {user && (
                <div className="mx-4 mb-4 rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 p-4 shadow-lg shadow-primary-600/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white/30 shadow-md">
                      <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
                      <AvatarFallback className="bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
                        {initials.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{fullName}</p>
                      {user.phone && (
                        <p className="text-xs text-white/70 font-medium direction-ltr text-right">
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 🧭 Navigation links */}
              <nav className="flex flex-1 flex-col gap-y-2 overflow-y-auto px-4 pb-4">
                {navItems.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          '-mx-3 flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-all duration-200 active:scale-[0.98]',
                          isActive
                            ? 'bg-primary-50 text-primary-600 shadow-sm'
                            : 'text-neutral-950 hover:bg-neutral-50'
                        )}
                      >
                        {label}
                        <MdKeyboardArrowLeft color={isActive ? '#2c5be4' : '#000'} size={24} />
                      </Link>
                    </SheetClose>
                  );
                })}

                {/* 📅 Appointments link */}
                {user && (
                  <SheetClose asChild>
                    <Link
                      href="/appointments"
                      aria-current={pathname === '/appointments' ? 'page' : undefined}
                      className={cn(
                        '-mx-3 flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-all duration-200 active:scale-[0.98]',
                        pathname === '/appointments'
                          ? 'bg-linear-to-l from-secondary-50 to-secondary-100/50 text-secondary-600 shadow-sm'
                          : 'text-neutral-950 hover:bg-neutral-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                            pathname === '/appointments'
                              ? 'bg-secondary-600 text-white shadow-md shadow-secondary-600/30'
                              : 'bg-neutral-100 text-neutral-600'
                          )}
                        >
                          <Calendar className="h-4.5 w-4.5" />
                        </div>
                        <span>لیست نوبت‌ها</span>
                      </div>
                      <MdKeyboardArrowLeft color={pathname === '/appointments' ? '#479e13' : '#000'} size={24} />
                    </Link>
                  </SheetClose>
                )}

                {/* 🚪 Logout button */}
                {user && (
                  <>
                    <div className="my-2 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={cn(
                        '-mx-3 flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 active:scale-[0.98]',
                        'hover:bg-danger-50 disabled:opacity-50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-100 text-danger-600 transition-colors group-hover:bg-danger-200">
                          {isLoggingOut ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          ) : (
                            <LogOut className="h-4.5 w-4.5" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-danger-600">خروج از حساب</span>
                      </div>
                      <MdKeyboardArrowLeft color="#ec2a2a" size={24} />
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <Button className="md:hidden" aria-label="Open menu" disabled>
            <HugeiconsIcon icon={Menu01Icon} color="#262626" />
          </Button>
        )}

        {/* 🏷️ Logo */}
        <Link href="/" className="flex items-center gap-x-2" aria-label="Home">
          <Image
            src="/images/Logo.jpg"
            alt="Dr. Reserve"
            width={32}
            height={32}
            className="size-6 sm:size-8"
            priority
            sizes="(max-width: 640px) 24px, 32px"
          />
          <span className="text-lg font-medium">
            دکتر <span className="text-primary-600">رزرو</span>
          </span>
        </Link>
      </div>

      {/* 👤 Mobile avatar */}
      {user && (
        <Link href="/profile" className="md:hidden" aria-label="Profile">
          <Avatar className="h-9 w-9 ring-2 ring-primary-100 transition-all duration-200 hover:ring-primary-300 active:scale-95">
            <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-linear-to-br from-primary-100 to-primary-200 text-xs font-bold text-primary-700">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      {/* 🔓 Mobile login */}
      {!user && (
        <Link
          href="/auth/login"
          className="rounded-xl bg-linear-to-l from-primary-600 to-primary-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-transform active:scale-95 md:hidden"
        >
          ورود
        </Link>
      )}
    </>
  );
};
