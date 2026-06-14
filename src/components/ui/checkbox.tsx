// ☑️ Checkbox — Radix-based with primary-blue theme + indeterminate state
'use client';

import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // 🏗️ Layout + default look
        'peer size-4 shrink-0 rounded-[5px] border border-neutral-300 bg-white',
        // ✅ Checked / ➖ indeterminate → primary-500
        'data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 data-[state=checked]:text-white',
        'data-[state=indeterminate]:border-primary-500 data-[state=indeterminate]:bg-primary-500 data-[state=indeterminate]:text-white',
        // 🎯 Focus ring + 🚫 disabled + ✨ transition
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2',
        'transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {/* ➖ indeterminate vs ✅ checked icon */}
        {props.checked === 'indeterminate' ? (
          <Minus className="size-3" />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
