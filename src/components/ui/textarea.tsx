import * as React from 'react';
import { cn } from '@/lib/utils';

// 📝 Textarea with consistent validation states matching Input component
function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // 📦 Base styles - layout, sizing, typography
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent',
        'px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'min-h-[120px] resize-y',
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

export { Textarea };
