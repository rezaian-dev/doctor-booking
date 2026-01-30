import { Button } from '@/components/ui/button';
import { OTPInput } from './otp-input';
import { SubmitButton } from './submit-button';
import { ResendTimer } from './resend-timer';

interface OTPVerificationStepProps {
  otpValue: string;
  onOtpChange: (value: string) => void;
  otpError?: string;
  isSubmitting: boolean;
  onSubmit: () => void;
  onResend: () => Promise<void>;
  onBack: () => void;
  phoneNumber: string;
  userInfo?: string;
}

/**
 * 🔐 OTP verification step – used in both login & signup flows
 * 🔄 Full user control: verify, resend, or go back to edit info
 * ⏳ Smart submit button: disabled until 5-digit code is entered
 * 🧩 Composed from reusable sub-components (OTPInput, ResendTimer, etc.)
 * ♿ Accessible form structure with proper loading & error states
 */
export const OTPVerificationStep = ({
  otpValue,
  onOtpChange,
  otpError,
  isSubmitting,
  onSubmit,
  onResend,
  onBack,
  phoneNumber,
  userInfo,
}: OTPVerificationStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-1.5 md:space-y-5">
      {/* 🔑 OTP input with context (phone + optional user info) */}
      <OTPInput
        value={otpValue}
        onChange={onOtpChange}
        error={otpError}
        disabled={isSubmitting}
        phoneNumber={phoneNumber}
        userInfo={userInfo}
      />

      {/* ▶️ Submit only when full code is entered */}
      <SubmitButton
        isLoading={isSubmitting}
        disabled={otpValue.length !== 5}
        loadingText="در حال تأیید..."
        buttonText="تأیید و ثبت‌نام"
      />

      {/* 🕒 Auto-disabled resend with countdown timer */}
      <ResendTimer onResend={onResend} />

      {/* ↩️ Back to previous step (e.g., edit phone or profile) */}
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full text-neutral-600 hover:text-neutral-900"
      >
        ویرایش اطلاعات
      </Button>
    </form>
  );
};
