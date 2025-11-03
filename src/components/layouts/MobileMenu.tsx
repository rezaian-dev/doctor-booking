"use client";

import { ArrowLeft2 } from "iconsax-reactjs";
import Link from "next/link";
import { RefObject, useEffect, useRef } from "react";
import clsx from "clsx";

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

export const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  toggleButtonRef,
}: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 🖱️ Close menu on outside click (skip if click is on toggle button or menu)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        toggleButtonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) return;
      onClose();
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  return (
    <>
      {/* 🌫️ Semi-transparent backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-primary-50/30 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* 📦 Slide-in menu drawer */}
      <div
        ref={menuRef}
        className={clsx(
          "fixed top-16 right-0 h-full w-[246px] bg-white z-50 flex flex-col px-4 pt-5 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-y-5 mt-2">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center justify-between text-neutral-950 font-medium text-[15px] hover:text-primary-600 transition-colors"
            >
              {label}
              <ArrowLeft2 size={22} className="text-neutral-800" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
