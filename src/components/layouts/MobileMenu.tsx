"use client";

import { ArrowLeft2 } from "iconsax-reactjs";
import Link from "next/link";
import { RefObject, useEffect, useRef } from "react";
import clsx from "clsx";
import Image from "next/image";

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

  // 🖱️ Close menu on outside click
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
  }, [onClose, toggleButtonRef]);

  return (
 <>
      {/* 🌫️ Backdrop with fade */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-primary-50/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* 📦 Menu drawer with fade + slide */}
      <div
        ref={menuRef}
        className={clsx(
          "fixed top-0 right-0 h-full w-[246px] bg-white z-50 flex flex-col px-4 pt-5 shadow-xl md:hidden",
          // Always keep the element in the layout for smooth closing
          "transition-all duration-300 ease-in-out",
          isOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        {/* ❌ Close button */}
        <button
          onClick={onClose}
          className="self-end mb-6 p-1 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <Image
            src="/svgs/cancel-01.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>

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
