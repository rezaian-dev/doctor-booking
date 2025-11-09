'use client';

// 🎯 Core React & Next.js
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import clsx from 'clsx';

// 🧩 UI & Icons
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// 📱 Mobile-specific component
import { MobileMenu } from './MobileMenu';

/**
 * 🏷️ Site Header – Fully responsive, accessible, and performance-optimized
 * ✅ Semantic HTML (role="banner")
 * ✅ Keyboard & screen reader friendly
 * ✅ Active link highlighting
 * ✅ Optimized logo loading (LCP)
 * ✅ Mobile menu with focus trapping
 */
const navItems = [
  { href: '/doctors', label: 'لیست پزشکان' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
] as const;

export const Header = () => {
  // 📍 Current route for active link detection
  const pathname = usePathname();

  // 📱 Mobile menu state & focus management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* 🏗️ Main site header – semantic & accessible */}
      <header
        role="banner"
        className={clsx(
          'bg-white relative z-50',
          'md:border-b border-neutral-100',
          'shadow-sm md:shadow-none'
        )}
      >
        <div
          className={clsx(
            'md:container flex items-center justify-between',
            'h-16 px-4 md:px-8'
          )}
        >
          {/* 🏷️ Branding + mobile toggle */}
          <div className="flex items-center gap-x-4">
            <button
              ref={toggleButtonRef}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden"
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            >
              <HugeiconsIcon icon={Menu01Icon} color="#262626" aria-hidden="true" />
            </button>

            {/* 🔖 Site logo – not an h1 to preserve semantic structure */}
            <Link
              href="/"
              className="flex items-center gap-x-2"
              aria-label="دکتر رزرو – صفحه اصلی"
            >
              <Image
                src="/images/Logo.jpg"
                alt="دکتر رزرو – رزرو آنلاین نوبت پزشک"
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8"
                priority
                sizes="(max-width: 640px) 24px, 32px"
              />
              <span className="font-medium md:font-bold text-lg md:text-2xl">
                دکتر <span className="text-primary-500">رزرو</span>
              </span>
            </Link>
          </div>

          {/* 💻 Desktop navigation – with active state */}
          <nav className="hidden md:flex gap-x-9 lg:gap-x-10">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={clsx(
                  'text-neutral-950 hover:text-primary-500 font-medium transition-colors',
                  pathname === href && 'text-primary-500'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 🔐 Auth CTA – consistent across all pages */}
          <Link
            href="/login"
            className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
          >
            ورود / ثبت نام
          </Link>
        </div>
      </header>

      {/* 📱 Mobile menu overlay – handles focus trapping & a11y */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        toggleButtonRef={toggleButtonRef}
      />
    </>
  );
};

export default Header;
