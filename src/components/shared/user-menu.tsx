// components/shared/user-menu.tsx
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import type { User as UserType } from '@/types/user';

interface UserMenuProps {
  initialUser: UserType | null;
}

export function UserMenu({ initialUser }: UserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();

  if (!initialUser) {
    return (
      <Link
        href="/auth/login"
        className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors px-4 py-2 rounded-lg hover:bg-primary-50"
      >
        ورود / ثبت نام
      </Link>
    );
  }

  const initials = (initialUser.firstName?.charAt(0) ?? '') + (initialUser.lastName?.charAt(0) ?? '') || 'U';
  const firstName = initialUser.firstName || 'کاربر';

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        startTransition(() => {
          router.push('/');
          router.refresh();
        });
      } else {
        setIsLoggingOut(false);
      }
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <DropdownMenu dir="rtl" open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full hover:bg-neutral-50 px-2 md:px-3 relative z-50"
            disabled={isLoggingOut}
          >
            <Avatar className="h-9 w-9 border-2 border-neutral-100">
              <AvatarImage src={initialUser.avatar ?? undefined} />
              <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold text-sm">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="hidden md:block text-sm font-medium text-neutral-900 max-w-25 truncate">
              {firstName}
            </span>

            <ChevronDown
              className={`h-4 w-4 text-neutral-600 hidden md:block transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 z-50" sideOffset={8}>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer flex items-center py-2.5">
              <User className="ml-2 h-4 w-4" />
              <span>جزئیات حساب</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/appointments" className="cursor-pointer flex items-center py-2.5">
              <Calendar className="ml-2 h-4 w-4" />
              <span>لیست نوبت‌ها</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer py-2.5"
          >
            {isLoggingOut ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="ml-2 h-4 w-4" />
            )}
            <span>خروج از حساب</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
