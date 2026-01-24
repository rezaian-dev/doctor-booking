import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  phoneNumber?: string;
  userInfo?: string;
}

/**
 * 🔑 OTP input with contextual feedback & accessibility
 * 📱 Shows target phone number + optional user info (e.g., during signup)
 * 🎯 Auto-focused, LTR numeric slots for optimal mobile UX
 * ⚠️ Fixed-height error container prevents layout shift
 * ♿ Fully accessible (aria-invalid, semantic structure)
 */
export const OTPInput = ({
  value,
  onChange,
  error,
  disabled,
  phoneNumber,
  userInfo,
}: OTPInputProps) => {
  return (
    <div className="text-center">
      {/* 📲 Display destination phone number */}
      <p className="text-sm text-neutral-600 mb-2">
        کد تأیید به شماره{' '}
        <span className="font-semibold text-neutral-900 font-mono" dir="ltr">
          {phoneNumber}
        </span>{' '}
        ارسال شد
      </p>

      {/* ℹ️ Optional context (e.g., "Signing up as Fateme Tayebi") */}
      {userInfo && <p className="text-xs text-neutral-500 mb-6">{userInfo}</p>}

      {/* 🔢 OTP input group – LTR, auto-focused, 5-digit */}
      <div className="flex justify-center my-4">
        <InputOTP
          maxLength={5}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          disabled={disabled}
          autoFocus
        >
          <InputOTPGroup className="gap-2" dir="ltr">
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* ⚠️ Stable error display (no layout jump) */}
      <div className="h-6 mt-2">
        {error && (
          <p className="text-danger-500 text-sm animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
};
