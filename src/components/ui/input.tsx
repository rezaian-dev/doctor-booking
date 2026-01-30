import * as React from 'react';

import { cn } from '@/lib/utils/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // 📦 Base styles - layout, sizing, typography
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent',
        'px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

        // ⚠️ Error state - ALWAYS Red when invalid (even on focus)
        'aria-invalid:border-[#FF6565] aria-invalid:ring-[#FF6565]/20 aria-invalid:ring-[3px]',
        'dark:aria-invalid:ring-[#FF6565]/30',

        // 🎯 Error state on focus - MUST stay Red
        'aria-invalid:focus-visible:border-[#FF6565] aria-invalid:focus-visible:ring-[#FF6565]/20 aria-invalid:focus-visible:ring-[3px]',
        'dark:aria-invalid:focus-visible:ring-[#FF6565]/30',

        // ✨ Focus state - Blue ONLY when valid (not invalid)
        'focus-visible:not-aria-invalid:border-[#4179F0] focus-visible:not-aria-invalid:ring-[#4179F0]/20 focus-visible:not-aria-invalid:ring-[3px]',
        'dark:focus-visible:not-aria-invalid:ring-[#4179F0]/30',

        className
      )}
      {...props}
    />
  );
}

export { Input };
