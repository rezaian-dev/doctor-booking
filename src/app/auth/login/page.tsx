'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { AuthForm } from '@/components/auth/AuthForm';
import { LoginPhoneStep } from '@/components/auth/LoginPhoneStep';
import { OTPInput } from '@/components/auth/OTPInput';
import { SubmitButton } from '@/components/auth/SubmitButton';
import { ResendTimer } from '@/components/auth/ResendTimer';
import {
  LoginPhoneInput,
  OtpInput,
  loginPhoneSchema,
  otpSchema,
} from '@/lib/validations/auth';
import {
  sendLoginOtp,
  verifyLoginOtp,
  resendOtp,
} from '@/services/auth.service';
import {
  showOtpSentSuccess,
  showOtpSentError,
  showOtpResendSuccess,
  showOtpResendError,
  showLoginSuccess,
  showInvalidOtpError,
} from '@/utils/toast-messages';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';
import Header from '@/components/layouts/Header';

/**
 * 📱 Two-step login flow: Phone → OTP → Redirect to /profile
 * ✨ Form validation via react-hook-form + yup
 * 🔔 Real-time feedback with sonner toasts
 * 🔄 Full UX support: back, resend, loading, error states
 */
const LoginPage: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  // 📞 Phone form setup
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: errorsPhone, isSubmitting: isSubmittingPhone },
  } = useForm<LoginPhoneInput>({
    resolver: yupResolver(loginPhoneSchema),
  });

  // 🔑 OTP form setup
  const {
    setValue: setOtpValue,
    watch: watchOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
  } = useForm<OtpInput>({
    resolver: yupResolver(otpSchema),
  });

  const otpValue = watchOtp('otp') || '';

  // 📤 Submit phone → request OTP
  const onSubmitPhone = async (data: LoginPhoneInput) => {
    try {
      await sendLoginOtp(data);
      setPhoneNumber(data.phone);
      setStep('otp');
      showOtpSentSuccess(data.phone);
    } catch {
      showOtpSentError();
    }
  };

  // 🔍 Verify OTP → login & redirect
  const onSubmitOtp = async (data: OtpInput) => {
    try {
      await verifyLoginOtp(data);
      showLoginSuccess();
      setTimeout(() => router.replace('/profile'), 1000);
    } catch {
      showInvalidOtpError();
    }
  };

  // 🔄 Resend OTP
  const handleResendOtp = async () => {
    try {
      await resendOtp();
      showOtpResendSuccess();
    } catch {
      showOtpResendError();
    }
  };

  // ↩️ Back to phone input
  const handleBackToPhone = () => setStep('phone');

  return (
    <>
      <Toaster position="top-center" richColors expand={false} dir="rtl" />
      <Header />
      <AuthForm
        title="ورود به دکتر رزرو"
        description={
          step === 'phone'
            ? 'شماره موبایل خود را وارد کنید'
            : 'کد ارسال شده را وارد کنید'
        }
        footerText="حساب کاربری ندارید؟"
        footerLinkText="ثبت‌نام کنید"
        footerLinkHref="/auth/signup"
      >
        {step === 'phone' ? (
          <LoginPhoneStep
            register={registerPhone}
            errors={errorsPhone}
            isSubmitting={isSubmittingPhone}
            onSubmit={handleSubmitPhone(onSubmitPhone)}
          />
        ) : (
          <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-1.5">
            <OTPInput
              value={otpValue}
              onChange={(value) => setOtpValue('otp', value)}
              error={errorsOtp.otp?.message}
              disabled={isSubmittingOtp}
              phoneNumber={phoneNumber}
            />
            <SubmitButton
              isLoading={isSubmittingOtp}
              disabled={otpValue.length !== 5}
              loadingText="در حال تأیید..."
              buttonText="تأیید و ورود"
            />
            <ResendTimer onResend={handleResendOtp} />
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToPhone}
              className="w-full text-neutral-600 hover:text-neutral-900"
            >
              تغییر شماره موبایل
            </Button>
          </form>
        )}
      </AuthForm>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default LoginPage;
