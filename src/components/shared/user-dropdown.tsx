// components/shared/user-menu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/providers/auth-provider';
import { cn } from '@/lib/utils/cn';

/**
 * 👤 User dropdown menu with elegant UI
 * ✅ Fully RTL & accessible
 * ⚡ Zero prop drilling - reads directly from AuthProvider
 * 🎨 No hydration issues - uses suppressHydrationWarning
 * 🧹 Clean code with cn utility
 */
export function UserDropdown() {
  const { user, logout } = useAuth(); // ✅ Single source of truth
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🚪 Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    // ℹ️ No need to reset - component will unmount after redirect
  };

  // 🔓 Guest mode: show login CTA
  if (!user) {
    return (
      <Link href="/auth/login" suppressHydrationWarning>
        <Button
          variant="default"
          className="relative overflow-hidden rounded-2xl bg-linear-to-l from-primary-500 to-primary-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/50"
        >
          <span className="relative z-10 flex items-center gap-2">
            ورود / ثبت‌نام
          </span>
          <div className="absolute inset-0 bg-linear-to-l from-primary-400 to-primary-500 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </Button>
      </Link>
    );
  }
  // 🧠 Prepare user display data
  const firstName = user.firstName || 'کاربر';
  const lastName = user.lastName || '';
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'کاربر';
  const initials = (firstName[0] + (lastName[0] || '')).toUpperCase() || 'U';

  return (
    <DropdownMenu dir="rtl" open={isOpen} onOpenChange={setIsOpen}>
      {/* 🎯 Trigger using shadcn/ui Button */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'group relative z-50 flex h-auto cursor-pointer items-center gap-2.5 rounded-2xl px-2 py-1.5',
            'transition-all duration-300 hover:bg-neutral-50',
            'disabled:pointer-events-none disabled:opacity-50',
            'md:px-3 md:py-2'
          )}
          disabled={isLoggingOut}
          aria-label="User menu"
          suppressHydrationWarning
        >
          {/* 👤 Avatar */}
          <Avatar className="h-10 w-10 ring-2 ring-neutral-100 ring-offset-2 transition-all duration-300 group-hover:ring-primary-200">
            <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-linear-to-br from-primary-100 to-primary-200 text-sm font-bold text-primary-700">
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* 📛 First name (desktop only) */}
          <span className="hidden max-w-28 truncate text-sm font-bold text-neutral-800 md:block">
            {firstName}
          </span>

          {/* 🔽 Chevron indicator */}
          <ChevronDown
            className={cn(
              'hidden h-4 w-4 text-neutral-500 transition-all duration-300 md:block',
              isOpen && 'rotate-180 text-primary-500'
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      {/* 📋 Dropdown content */}
      <DropdownMenuContent
        align="end"
        className="z-50 w-64 overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/95 p-2 shadow-2xl backdrop-blur-xl"
        sideOffset={16}
      >
        {/* 👤 User header */}
        <div className="mb-2 rounded-xl bg-linear-to-br from-primary-500 to-primary-600 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white/40 shadow-lg">
              <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-white/20 text-sm font-bold text-white backdrop-blur">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{fullName}</p>
              <p className="text-xs text-white/80">مدیریت حساب کاربری</p>
            </div>
          </div>
        </div>

        {/* 🔗 Profile link */}
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary-50 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
              <User className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-medium text-neutral-800">جزئیات حساب</span>
          </Link>
        </DropdownMenuItem>

        {/* 🔗 Appointments link */}
        <DropdownMenuItem asChild>
          <Link
            href="/appointments"
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-blue-50 focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-medium text-neutral-800">لیست نوبت‌ها</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-neutral-200" />

        {/* 🚪 Logout action */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
            'transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none',
            'disabled:opacity-50'
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors group-hover:bg-red-200">
            {isLoggingOut ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <LogOut className="h-4.5 w-4.5" />
            )}
          </div>
          <span className="text-sm font-medium text-red-600">خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
