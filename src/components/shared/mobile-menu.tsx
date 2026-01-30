// components/shared/mobile-menu.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Cancel01Icon, Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '../ui/sheet';
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useEffect, useState } from 'react';
import clsx from 'clsx';

// 📝 Types
interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navItems: readonly NavItem[];
}

/**
 * 📱 Mobile Navigation Menu
 * - Triggered by hamburger icon on small screens
 * - Uses Radix UI Dialog (via shadcn/ui Sheet) for modal behavior
 * - Fully accessible with proper ARIA labels and focus management
 * - Self-contained: no external state management required
 * - 🔥 Fixed: Hydration mismatch resolved with client-only rendering
 * - ✨ Enhanced: Shows active page highlighting
 */
export const MobileMenu = ({ navItems }: MobileMenuProps) => {
  const pathname = usePathname();

  // 🔥 State to detect client-side rendering (avoids SSR hydration mismatch)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-x-4">
      {/* 🍔 Hamburger menu trigger */}
      {isClient ? (
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="md:hidden"
              aria-label="Open mobile navigation menu"
            >
              <HugeiconsIcon icon={Menu01Icon} color="#262626" aria-hidden="true" />
            </button>
          </SheetTrigger>

          {/* 🗂️ Mobile menu sheet */}
          <SheetContent side="right" className="w-61.5 p-0 flex flex-col md:hidden">
            {/* ❌ Close button */}
            <div className="px-4 pt-5 self-end">
              <SheetClose asChild>
                <button
                  className="self-start mb-1 rounded-md focus:outline-none"
                  aria-label="Close mobile menu"
                >
                  <HugeiconsIcon icon={Cancel01Icon} color="#000000" size={24} />
                </button>
              </SheetClose>

              {/* 🎯 Accessibility labels (visually hidden) */}
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate to main sections of Dr. Reserve website
              </SheetDescription>
            </div>

            {/* 🧭 Scrollable navigation links */}
            <nav className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-y-6">
              {navItems.map(({ href, label }) => {
                const isActive = pathname === href;

                return (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={clsx(
                        'flex items-center justify-between font-medium text-[15px] transition-colors py-2 rounded-lg px-3 -mx-3',
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-neutral-950 hover:text-primary-600 hover:bg-neutral-50'
                      )}
                    >
                      {label}
                      <MdKeyboardArrowLeft
                        color={isActive ? '#0066FF' : '#000'}
                        size={24}
                      />
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        // 🔥 SSR-safe placeholder button (non-interactive during server render)
        <button
          className="md:hidden"
          aria-label="Open mobile navigation menu"
          disabled
        >
          <HugeiconsIcon icon={Menu01Icon} color="#262626" aria-hidden="true" />
        </button>
      )}

      {/* 🏷️ Brand logo */}
      <Link href="/" className="flex items-center gap-x-2" aria-label="Home">
        <Image
          src="/images/Logo.jpg"
          alt="Dr. Reserve – Online doctor appointment booking"
          width={32}
          height={32}
          className="size-6 sm:size-8"
          priority
          sizes="(max-width: 640px) 24px, 32px"
        />
        <span className="font-medium text-lg">
          دکتر <span className="text-primary-500">رزرو</span>
        </span>
      </Link>
    </div>
  );
};
