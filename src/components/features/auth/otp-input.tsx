'use client';

import { Lock } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toFaDigits } from '@/lib/utils/persian-format';
import { cn } from '@/lib/utils/cn';

const MAX_ATTEMPTS = 3;       // 🔒 OTP retry budget
const OTP_SLOTS = [0, 1, 2, 3, 4] as const; // 🔢 5-digit code → fixed slot indices

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  attemptsLeft?: number | null;
  disabled?: boolean;
  phoneNumber?: string;
  userInfo?: string | undefined;
}

export const OTPInput = ({
  value,
  onChange,
  error,
  attemptsLeft,
  disabled,
  phoneNumber,
  userInfo,
}: OTPInputProps) => {
  const hint =
    error ||
    (typeof attemptsLeft === 'number' && attemptsLeft > 0
      ? `${toFaDigits(attemptsLeft)} تلاش باقی‌مانده`
      : '');

  const maxAttempts = MAX_ATTEMPTS;
  const usedAttempts =
    typeof attemptsLeft === 'number' ? maxAttempts - attemptsLeft : 0;

  return (
    <div className="text-center">

      {/* 🔒 Lock glyph */}
      <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-primary-50 border-[1.5px] border-primary-100">
        <Lock className="h-5.5 w-5.5 text-primary-600" strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* 🏷️ Title */}
      <p className="text-[15px] font-semibold text-neutral-950 mb-1.5">
        تأیید شماره موبایل
      </p>

      {/* 📱 Destination number */}
      <p className="text-xs text-neutral-600 leading-loose mb-3.5">
        کد ۵ رقمی ارسال‌شده به{' '}
        <span
          className="inline-flex items-center rounded-[7px] bg-primary-50 border border-primary-100 px-2 py-px font-mono text-[12px] font-semibold text-primary-800"
          dir="ltr"
        >
          {phoneNumber}
        </span>{' '}
        را وارد کنید
      </p>

      {/* 👤 User label */}
      {userInfo && (
        <p className="text-[11px] text-neutral-500 mb-2.5">{userInfo}</p>
      )}

      {/* ⚪ Attempts indicator */}
      {typeof attemptsLeft === 'number' && (
        <div
          className="flex items-center justify-center gap-1 mb-3"
          aria-hidden="true"
        >
          {Array.from({ length: maxAttempts }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.75 w-1.75 rounded-full transition-all duration-300',
                i < usedAttempts
                  ? 'bg-danger-400 scale-[.85]'
                  : 'bg-primary-300'
              )}
            />
          ))}
        </div>
      )}

      {/* 🔢 OTP slots */}
      <div className="my-5 flex justify-center py-1">
        <InputOTP
          maxLength={5}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          disabled={disabled}
          autoFocus
        >
          <InputOTPGroup className={cn('gap-2.5', error && 'animate-otp-shake')} dir="ltr">
            {OTP_SLOTS.map(i => <InputOTPSlot key={i} index={i} />)}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* 💬 Fixed-height feedback line */}
      <div className="flex h-5 items-center justify-center" aria-live="polite">
        {hint && (
          <p
            className={cn(
              'animate-otp-fade flex items-center gap-1.5 text-[11.5px]',
              error ? 'text-danger-500' : 'text-alert'
            )}
          >
            <span aria-hidden="true">{error ? '✕' : '⚠'}</span>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};
