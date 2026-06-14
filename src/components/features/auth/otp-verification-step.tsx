'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OTPInput } from './otp-input';
import { SubmitButton } from './submit-button';
import { ResendTimer } from './resend-timer';

interface OTPVerificationStepProps {
  otpValue: string;
  onOtpChange: (value: string) => void;
  otpError?: string;
  attemptsLeft?: number | null;
  isSubmitting: boolean;
  onSubmit: () => void;
  onResend: () => Promise<void>;
  onBack: () => void;
  phoneNumber: string;
  userInfo?: string;
}

export const OTPVerificationStep = ({
  otpValue,
  onOtpChange,
  otpError,
  attemptsLeft,
  isSubmitting,
  onSubmit,
  onResend,
  onBack,
  phoneNumber,
  userInfo,
}: OTPVerificationStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-3">

      <OTPInput
        value={otpValue}
        onChange={onOtpChange}
        error={otpError}
        attemptsLeft={attemptsLeft ?? null}
        disabled={isSubmitting}
        phoneNumber={phoneNumber}
        userInfo={userInfo}
      />

      <SubmitButton
        isLoading={isSubmitting}
        disabled={otpValue.length !== 5}
        loadingText="در حال تأیید..."
        buttonText="تأیید و ادامه"
      />

      <ResendTimer onResend={onResend} />

      <div className="border-t border-neutral-100" />

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full h-9 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 text-[12.5px]"
      >
        <ArrowRight className="ml-1.5 h-3 w-3" aria-hidden="true" />
        ویرایش اطلاعات
      </Button>
    </form>
  );
};
