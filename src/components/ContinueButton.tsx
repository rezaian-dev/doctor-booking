'use client';

import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';

/**
 * 🧭 ContinueButton – A reusable, accessible, and responsive primary action button.
 * Supports both navigation (via `href`) and client-side actions (via `onClick`).
 * Designed for RTL (Persian) UI with arrow placement after text.
 *
 * ⚠️ Note: Using <Link> with `href='#'` and `onClick` can cause accessibility and hydration issues.
 * For pure client-side actions, prefer a <button> element.
 */
interface ContinueButtonProps {
  /** 📝 Button label text (in Persian) */
  text: string;
  /** 🎨 UI variant: 'payment' for larger height, 'default' for compact layout */
  mode: 'payment' | 'default';
  /** 🚫 Disables interaction and applies inactive styling */
  disabled?: boolean;
  /** 🔗 Optional Next.js route for navigation (if omitted, treated as client-side action) */
  href?: string;
  /** ✨ Callback for client-side logic (e.g., form submission, state update) */
  onClick?: () => void;
}

const ContinueButton = ({
  text,
  mode,
  disabled = false,
  href = '#',
  onClick,
}: ContinueButtonProps) => {
  /**
   * 🖱️ Handles click events:
   * - Prevents navigation if disabled.
   * - Executes `onClick` only when enabled.
   */
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  return (
    /**
     * 🚨 Accessibility Warning:
     * Using <Link> with `href='#'` is not semantic for non-navigation actions.
     * Consider splitting into <Link> (for real routes) and <button> (for JS actions).
     * Also, `aria-disabled` is not fully effective on <a> tags — prefer `disabled` on <button>.
     */
    <Link
      href={disabled ? '#' : href}
      onClick={handleClick}
      aria-disabled={disabled} // 👁️ Only a hint; not fully respected by all ATs
      className={clsx(
        // Base styles
        'w-full font-medium rounded-xl text-white flex items-center justify-center gap-x-1.5 transition-colors',
        // Disabled state
        disabled
          ? 'bg-primary-300 cursor-not-allowed'
          : 'bg-primary-500 hover:bg-primary-600',
        // Mode-specific sizing
        mode === 'payment'
          ? 'h-[49px] text-base gap-x-2 max-w-full'
          : 'h-10 text-sm max-w-[394px] mx-auto'
      )}
    >
      {text}
      {/* 🔄 In RTL (Persian), this arrow appears on the LEFT visually due to directionality,
          but is placed AFTER text in DOM for correct semantic flow. */}
      <IoIosArrowBack size={20} color="#fff" />
    </Link>
  );
};

export default ContinueButton;