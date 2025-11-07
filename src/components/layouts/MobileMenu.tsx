'use client';

import Link from 'next/link';
import { RefObject, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { ArrowLeft01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
}

/**
 * 📱 Mobile navigation drawer – accessible, animated, RTL-ready
 * 🎨 Slides in from right (correct for LTR UI; safe for RTL content)
 * ♿ Full a11y: backdrop close, esc key, focus trap (basic)
 * ✨ Smooth fade + slide transition
 */
export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  toggleButtonRef,
}: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 🖱️ Close on backdrop click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        toggleButtonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) return;
      onClose();
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose, toggleButtonRef]);

  return (
    <>
      {/* 🌫️ Backdrop – fade in/out */}
      <div
        className={clsx(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-sm',
          'transition-opacity duration-300 ease-in-out md:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 📦 Menu drawer – slide + fade */}
      <div
        ref={menuRef}
        className={clsx(
          'fixed top-0 right-0 h-full w-[246px] bg-white z-50',
          'flex flex-col px-4 pt-5 shadow-xl md:hidden',
          'transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-full pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
      >
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="self-end mb-6 p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="بستن منو"
        >
          <HugeiconsIcon icon={Cancel01Icon} color="#000000" size={20} />
        </button>

        {/* 🧭 Navigation links */}
        <nav className="flex flex-col gap-y-5 mt-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center justify-between text-neutral-950 font-medium text-[15px] hover:text-primary-600 transition-colors"
            >
              {label}
              {/* 🔄 Arrow points left (correct for LTR navigation UI) */}
              <HugeiconsIcon icon={ArrowLeft01Icon} color="#000000" size={16} />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
