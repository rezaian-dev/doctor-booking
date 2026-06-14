// 🏷️ Label — accessible Radix label with RTL-friendly styling
'use client';

import { Label as LabelPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils/cn';

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // 🎨 Base + disabled-peer styling
        'block text-sm font-medium leading-none text-neutral-700',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}

export { Label };
