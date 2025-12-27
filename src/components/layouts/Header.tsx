'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { MobileMenu } from './MobileMenu';

/**
 * 🗺️ Navigation items shared across mobile & desktop
 * ✅ Keep in sync if nav structure changes
 */
const navItems = [
  { href: '/doctors', label: 'لیست پزشکان' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/about-us', label: 'درباره ما' },
  { href: '/contact-us', label: 'تماس با ما' },
] as const;

/**
 * 🏷️ Site Header – Responsive, accessible, and performance-optimized
 * ✨ Fully semantic with proper ARIA roles
 * 📱 Mobile: Sheet-based navigation via `MobileMenu`
 * 💻 Desktop: Inline nav with active state highlighting
 */
export const Header = () => {
  // 🔍 Get current route for active link detection
  const pathname = usePathname();

  return (
    <header
      role="banner"
      className="bg-white md:border-b border-neutral-100 shadow-sm md:shadow-none">
      <div
        className="md:container flex items-center justify-between h-16 px-4 md:px-8">
        {/* 📱 Mobile navigation – renders only on small screens */}
        <MobileMenu navItems={navItems} />

        {/* 💻 Desktop navigation – hidden on mobile */}
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

        {/* 🔐 Authentication CTA – consistent across all viewports */}
        <Link
          href="/login"
          className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
        >
          ورود / ثبت نام
        </Link>
      </div>
    </header>
  );
};

export default Header;
