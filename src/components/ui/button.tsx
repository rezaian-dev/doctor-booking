// 🔘 Button — CVA-based, polymorphic (asChild) button
'use client';

import Link from 'next/link';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  // 🏗️ Base styles
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white shadow-sm hover:bg-primary-600 active:bg-primary-700', // 🟦 primary
        destructive: 'bg-danger-500 text-white shadow-sm hover:bg-danger-600 active:bg-danger-700', // 🟥 danger
        outline: 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100', // ⬜ bordered
        ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-150', // 👻 no border
        link: 'text-primary-600 underline-offset-4 hover:underline', // 🔗 text-only
        success: 'bg-secondary-500 text-white shadow-sm hover:bg-secondary-600 active:bg-secondary-700', // 🟩 success
        warning: 'bg-alert text-white shadow-sm hover:opacity-90', // ⚠️ warning
        subtle: 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100', // 🔵 subtle
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        xl: 'h-12 px-8 text-base',
        icon: 'size-9',
        'icon-sm': 'size-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    // 🔗 Render as the passed child element instead of a <button>
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// 🔗 Link styled as a button — applies buttonVariants directly to next/link. Prefer this
//    over <Button asChild><Link/>>: routing next/link through Radix Slot breaks SSR hydration. ✅
function ButtonLink({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, ButtonLink, buttonVariants };
