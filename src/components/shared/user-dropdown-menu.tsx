// 🧠 Interactive dropdown — always client-rendered.
// ✨ next/image avatar trigger preloads via SSR HTML → zero flash.
// 🔧 suppressHydrationWarning on trigger: a11y-only id drift (invisible to user).
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr'; // 🔄 wipe the whole SWR cache on logout (no cross-user data leak)
import { clearSessionHintClient, notifyAuthChange } from '@/lib/auth/session-hint'; // 🪪 drop hint + flip header live
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Calendar, ChevronDown, LoaderCircle, Inbox, Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { UserData } from '@/types/patient'; // 🔗 Shared user shape (DRY)

interface Props    { user: UserData; fullName: string; initials: string; unreadCount: number }

export default function UserDropdownMenu({ user, fullName, initials, unreadCount }: Props) {
  const router = useRouter();
  const [isOpen,       setIsOpen]       = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      // 🪪 Drop the client hint immediately → the header re-renders as a clean guest
      //    (login button, no skeleton) without waiting on the Set-Cookie round-trip. ✨
      clearSessionHintClient();
      // 🧹 Wipe the ENTIRE SWR cache on logout — not just /api/auth/me. Every user-scoped key
      //    (/api/profile, /api/appointments, inbox …) is dropped so the NEXT user can never read
      //    the previous user's cached data on a soft nav. 🔑 Root cause of the /profile stale-data bug.
      //    revalidate:false → keys clear instantly; each page refetches fresh on its next mount. ✨
      await mutate(() => true, undefined, { revalidate: false });
      // 📣 Notify every mounted header to re-read the cleared hint live → no manual refresh.
      notifyAuthChange();
      router.push('/'); // 🚀 soft nav only (refresh removed → no flash)
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu dir="rtl" open={isOpen} onOpenChange={setIsOpen}>
      {/* 🎯 Trigger — suppressHydrationWarning: only hidden aria-controls id differs */}
      <DropdownMenuTrigger asChild>
        <button
          suppressHydrationWarning
          disabled={isLoggingOut}
          className={cn(
            'group relative flex items-center gap-2.5 rounded-xl px-2 py-1.5 cursor-pointer',
            'hover:bg-neutral-50 active:scale-95 transition-all duration-200',
            'disabled:pointer-events-none disabled:opacity-50 md:px-3 md:py-2'
          )}
        >
          {/* 🖼️ next/image for avatar → SSR generates <img> tag → browser preloads it → no flash */}
          <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-neutral-100 ring-offset-2 transition-all duration-300 group-hover:ring-primary-300 bg-primary-100 flex items-center justify-center shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={fullName}
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            ) : (
              <span className="text-sm font-bold text-primary-700">{initials}</span>
            )}
          </div>
          <span className="hidden max-w-28 truncate text-sm font-bold text-neutral-800 md:block">
            {user.firstName}
          </span>
          <ChevronDown className={cn(
            'hidden h-4 w-4 text-neutral-500 transition-transform duration-300 md:block',
            isOpen && 'rotate-180 text-primary-600'
          )} />
        </button>
      </DropdownMenuTrigger>

      {/* 📋 Content — only mounted when open → no SSR IDs generated */}
      <DropdownMenuContent align="end" sideOffset={12}
        className="w-64 overflow-hidden rounded-2xl border border-neutral-150 bg-white p-2 shadow-2xl shadow-neutral-900/10">

        {/* 🎨 Profile header card */}
        <div className="mb-2 rounded-xl bg-linear-to-br from-primary-600 to-primary-700 p-4 shadow-lg shadow-primary-600/20">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-white/30 shadow-md">
              <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
              <AvatarFallback className="bg-white/20 text-sm font-bold text-white">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{fullName}</p>
              {user.phone && <p className="text-xs text-white/80 font-medium" dir="ltr" style={{ textAlign: 'right' }}>{user.phone}</p>}
            </div>
          </div>
        </div>

        <DropdownMenuItem asChild>
          <Link href="/profile" className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-primary-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600 group-hover:bg-primary-200"><User className="h-4 w-4" /></div>
            <span className="text-sm font-medium text-neutral-800">جزئیات حساب</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/appointments" className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-secondary-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 text-secondary-600 group-hover:bg-secondary-200"><Calendar className="h-4 w-4" /></div>
            <span className="text-sm font-medium text-neutral-800">لیست نوبت‌ها</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/inbox" className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-violet-50">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 group-hover:bg-violet-200">
              <Inbox className="h-4 w-4" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </div>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm font-medium text-neutral-800">صندوق ورودی</span>
              {unreadCount > 0 && <span className="flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white"><Bell size={10} fill="white" /> {unreadCount} جدید</span>}
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-neutral-150" />

        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}
          className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-danger-50 disabled:opacity-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-100 text-danger-600 group-hover:bg-danger-200">
            {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          </div>
          <span className="text-sm font-medium text-danger-600">خروج از حساب</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
