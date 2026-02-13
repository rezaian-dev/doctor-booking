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

export function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 🚪 Logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  // 🔓 Guest login button
  if (!user) {
    return (
      <Link href="/auth/login" suppressHydrationWarning>
        <Button
          variant="default"
          className="relative overflow-hidden rounded-xl bg-linear-to-l cursor-pointer from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/40"
        >
          ورود / ثبت‌نام
        </Button>
      </Link>
    );
  }

  // 🧠 User display data
  const firstName = user.firstName || 'کاربر';
  const lastName = user.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'کاربر';
  const initials = (firstName[0] + (lastName[0] || '')).toUpperCase();

  return (
    <DropdownMenu dir="rtl" open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'group relative cursor-pointer flex h-auto items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-300',
            'hover:bg-neutral-50 active:scale-95',
            'disabled:pointer-events-none disabled:opacity-50',
            'md:px-3 md:py-2'
          )}
          disabled={isLoggingOut}
          suppressHydrationWarning
        >
          {/* 👤 Avatar */}
          <Avatar className="h-10 w-10 ring-2 ring-neutral-100 ring-offset-2 transition-all duration-300 group-hover:ring-primary-300">
            <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
            <AvatarFallback className="bg-linear-to-br from-primary-100 to-primary-200 text-sm font-bold text-primary-700">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* 📛 First name desktop */}
          <span className="hidden max-w-28 truncate text-sm font-bold text-neutral-800 md:block">
            {firstName}
          </span>

          {/* 🔽 Chevron indicator */}
          <ChevronDown
            className={cn(
              'hidden h-4 w-4 text-neutral-500 transition-transform duration-300 md:block',
              isOpen && 'rotate-180 text-primary-600'
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 overflow-hidden rounded-2xl border border-neutral-150 bg-white p-2 shadow-2xl shadow-neutral-900/10"
        sideOffset={12}
      >
        {/* 👤 User header */}
        <div className="mb-2 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 p-4 shadow-lg shadow-primary-600/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white/30 shadow-md">
              <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-white/20 text-sm font-bold text-white backdrop-blur-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{fullName}</p>
              {user.phone && (
                <p className="text-xs text-white/80 font-medium" dir="ltr" style={{ textAlign: 'right' }}>
                  {user.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 🔗 Profile link */}
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-primary-50 active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
              <User className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-medium text-neutral-800">جزئیات حساب</span>
          </Link>
        </DropdownMenuItem>

        {/* 📅 Appointments link */}
        <DropdownMenuItem asChild>
          <Link
            href="/appointments"
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-secondary-50 active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600 transition-colors group-hover:bg-secondary-200">
              <Calendar className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-medium text-neutral-800">لیست نوبت‌ها</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-neutral-150" />

        {/* 🚪 Logout action */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
            'hover:bg-danger-50 active:scale-[0.98]',
            'disabled:opacity-50'
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-100 text-danger-600 transition-colors group-hover:bg-danger-200">
            {isLoggingOut ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <LogOut className="h-4.5 w-4.5" />
            )}
          </div>
          <span className="text-sm font-medium text-danger-600">خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
