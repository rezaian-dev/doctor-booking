'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        // 🧩 No overflow-hidden → lets the active slot's lift & glow breathe
        'flex items-center gap-2.5 has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed w-full!', className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(
        // 🧱 Base — compact slot size
        'relative flex h-11 w-10 items-center justify-center',
        'rounded-[12px] border-[1.5px] bg-neutral-30',
        'text-[18px] font-bold tabular-nums font-mono select-none',
        // 🪄 Smooth transition across all state changes
        'transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out',
        'outline-none focus:outline-none focus-visible:outline-none',

        // ⬜ Empty + inactive (subtle hover hint)
        !char &&
          !isActive &&
          'border-neutral-150 text-neutral-300 not-aria-invalid:hover:border-neutral-300',

        // ✅ Filled (digit set) + pop on fill
        char &&
          !isActive &&
          'border-primary-400 bg-primary-50 text-primary-700 shadow-[0_2px_8px_-3px_rgba(65,121,240,0.3)] animate-otp-slot-pop',

        // 🎯 Active/focus, no error (lifts up + soft halo)
        'data-[active=true]:not-aria-invalid:border-primary-500',
        'data-[active=true]:not-aria-invalid:bg-white',
        'data-[active=true]:not-aria-invalid:text-primary-700',
        'data-[active=true]:not-aria-invalid:-translate-y-0.5 data-[active=true]:not-aria-invalid:scale-[1.05]',
        'data-[active=true]:not-aria-invalid:shadow-[0_0_0_4px_rgba(65,121,240,0.14),0_8px_16px_-6px_rgba(65,121,240,0.45)]',
        'data-[active=true]:not-aria-invalid:z-10',

        // ❌ Error state
        'aria-invalid:border-danger-400 aria-invalid:bg-danger-50/60 aria-invalid:text-danger-600',
        'data-[active=true]:aria-invalid:border-danger-500',
        'data-[active=true]:aria-invalid:-translate-y-0.5 data-[active=true]:aria-invalid:scale-[1.05]',
        'data-[active=true]:aria-invalid:shadow-[0_0_0_4px_rgba(236,42,42,0.13),0_8px_16px_-6px_rgba(236,42,42,0.4)]',
        'data-[active=true]:aria-invalid:z-10',

        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* ✨ Slim blinking caret */}
          <div className="animate-caret-blink h-5.25 w-0.5 rounded-full bg-primary-500 duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
