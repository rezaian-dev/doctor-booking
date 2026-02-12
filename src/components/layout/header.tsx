'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { MobileMenu } from '../shared/mobile-menu';
import { UserDropdown } from '@/components/shared/user-dropdown';

// 🧭 Navigation items
const navItems = [
  { href: '/doctors', label: 'لیست پزشکان' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/about-us', label: 'درباره ما' },
  { href: '/contact-us', label: 'تماس با ما' },
] as const;

/**
 * 🎯 Main application header
 * 📱 Responsive with mobile menu
 * 🧭 Active route highlighting
 * 👤 Integrated user authentication menu
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-white/80 shadow-sm backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
        {/* 📱 Mobile menu with navigation */}
        <MobileMenu navItems={navItems} />

        {/* 🧭 Desktop navigation */}
        <nav className="hidden items-center gap-x-1 md:flex lg:gap-x-2">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group relative overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                  isActive ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'
                )}
              >
                {/* 🎨 Background hover effect */}
                <span
                  className={cn(
                    'absolute inset-0 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-linear-to-br from-primary-50 to-primary-100/50'
                      : 'bg-neutral-50/0 group-hover:bg-neutral-50'
                  )}
                />

                {/* 📝 Link text */}
                <span className="relative z-10">{label}</span>

                {/* 📍 Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-linear-to-r from-primary-400 via-primary-500 to-primary-600 shadow-lg shadow-primary-500/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 🔐 User authentication menu - no prop drilling! */}
        <div className="hidden min-w-35 justify-end md:flex">
          <UserDropdown />
        </div>
      </div>

      {/* ✨ Decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary-500/20 to-transparent" />
    </header>
  );
}

export default Header;
