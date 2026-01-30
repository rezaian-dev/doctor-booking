'use client';

import * as React from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { MinusIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

// 🔢 Main OTP input container component
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
        'flex items-center gap-2 over-flow-hidden! has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed w-full!', className)}
      {...props}
    />
  );
}

// 📦 Group wrapper for OTP slots
function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  );
}

// 🎯 Individual OTP slot with smart color logic
function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        // 📦 Base styles - layout, sizing, typography
        'relative flex h-9 w-9 items-center justify-center text-sm shadow-xs transition-all',
        'border first:rounded-l-md first:border-l last:rounded-r-md',
        'dark:bg-input/30 border-input',

        // 🚫 Remove browser default outline/focus ring
        'outline-none focus:outline-none focus-visible:outline-none',

        // ⚠️ Error state - ALWAYS Red when invalid (even on active/focus)
        'aria-invalid:border-[#FF6565]',
        'data-[active=true]:aria-invalid:border-[#FF6565] data-[active=true]:aria-invalid:ring-[#FF6565]/20 data-[active=true]:aria-invalid:ring-[3px]',
        'dark:data-[active=true]:aria-invalid:ring-[#FF6565]/30',

        // ✨ Active state - Blue ONLY when valid (not invalid)
        'data-[active=true]:not-aria-invalid:border-[#4179F0] data-[active=true]:not-aria-invalid:ring-[#4179F0]/20 data-[active=true]:not-aria-invalid:ring-[3px]',
        'dark:data-[active=true]:not-aria-invalid:ring-[#4179F0]/30',

        // 🎨 Active slot comes to front
        'data-[active=true]:z-10',

        className
      )}
      {...props}
    >
      {char}
      {/* 💫 Blinking caret indicator */}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

// ➖ Separator component for OTP groups
function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
