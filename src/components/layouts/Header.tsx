'use client';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { MobileMenu } from './MobileMenu';

const navItems = [
  { href: '/doctors', label: 'لیست پزشکان' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
] as const;

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* 🏗️ Main site header (desktop + mobile trigger) */}
      <header className="md:border-b border-neutral-100 shadow-sm md:shadow-none bg-white relative z-50">
        <div className="md:container flex items-center justify-between h-16 px-4 md:px-8">
          {/* 🏷️ Branding: logo + mobile menu button */}
          <div className="flex items-center gap-x-4">
            <button
              ref={toggleButtonRef}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden"
              aria-label="Toggle mobile menu"
            >
              <HugeiconsIcon icon={Menu01Icon} color='262626' />
            </button>

            <div className="flex items-center gap-x-2">
              <Image
                src="/images/Logo.jpg" // ✅ WebP for better quality & compression
                alt="دکتر رزرو Logo"
                width={32} // ✅ Real dimensions of the image file
                height={32} // ✅ Real dimensions of the image file
                className="w-6 h-6 sm:w-8 sm:h-8"
                priority
                sizes="(max-width: 640px) 24px, 32px" // ✅ Optional: for responsive optimization
              />
              <h2 className="font-medium md:font-bold text-lg md:text-2xl">
                دکتر <span className="text-primary-500">رزرو</span>
              </h2>
            </div>
          </div>

          {/* 💻 Desktop navigation */}
          <nav className="hidden md:flex gap-x-9 lg:gap-x-10">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-neutral-950 hover:text-primary-500 font-medium transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* 🔐 Auth link */}
          <Link
            href="/login"
            className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
          >
            ورود / ثبت نام
          </Link>
        </div>
      </header>

      {/* 📱 Controlled mobile menu */}
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
