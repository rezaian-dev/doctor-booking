'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';
import { AuthForm } from '@/components/auth/AuthForm';
import { SignupFormStep } from '@/components/auth/SignupFormStep';
import { OTPVerificationStep } from '@/components/auth/OTPVerificationStep';
import {
  SignupInput,
  OtpInput,
  signupSchema,
  otpSchema,
} from '@/lib/validations/auth';
import {
  sendSignupOtp,
  verifySignupOtp,
  resendOtp,
} from '@/services/auth.service';
import {
  showOtpSentSuccess,
  showOtpSentError,
  showOtpResendSuccess,
  showOtpResendError,
  showSignupSuccess,
  showInvalidOtpError,
} from '@/utils/toast-messages';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

/**
 * 📝 Two-step signup flow: Form → OTP → Redirect to /profile
 * ✨ Validated with react-hook-form + yup
 * 🔔 User feedback via sonner toasts (success/error)
 * 🔄 Full navigation: back, resend, loading, error states
 */
const SignupPage: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [userData, setUserData] = useState<SignupInput | null>(null);

  // 📋 Signup form setup
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup },
  } = useForm<SignupInput>({
    resolver: yupResolver(signupSchema),
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

  // 📤 Submit form → request OTP
  const onSubmitSignup = async (data: SignupInput) => {
    try {
      await sendSignupOtp(data);
      setUserData(data);
      setStep('otp');
      showOtpSentSuccess(data.phone);
    } catch {
      showOtpSentError();
    }
  };

  // 🔍 Verify OTP → complete signup & redirect
  const onSubmitOtp = async (data: OtpInput) => {
    try {
      await verifySignupOtp(data);
      showSignupSuccess(userData?.firstName || '');
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

  // ↩️ Back to form step
  const handleBackToForm = () => setStep('form');

  return (
    <>
      <Toaster position="top-center" richColors expand={false} dir="rtl" />
      <Header />
      <AuthForm
        title="ثبت‌نام در دکتر رزرو"
        description={
          step === 'form'
            ? 'اطلاعات خود را وارد کنید'
            : 'کد ارسال شده را وارد کنید'
        }
        footerText="قبلاً ثبت‌نام کرده‌اید؟"
        footerLinkText="وارد شوید"
        footerLinkHref="/auth/login"
      >
        {step === 'form' ? (
          <SignupFormStep
            register={registerSignup}
            errors={errorsSignup}
            isSubmitting={isSubmittingSignup}
            onSubmit={handleSubmitSignup(onSubmitSignup)}
          />
        ) : (
          <OTPVerificationStep
            otpValue={otpValue}
            onOtpChange={(value) => setOtpValue('otp', value)}
            otpError={errorsOtp.otp?.message}
            isSubmitting={isSubmittingOtp}
            onSubmit={handleSubmitOtp(onSubmitOtp)}
            onResend={handleResendOtp}
            onBack={handleBackToForm}
            phoneNumber={userData?.phone || ''}
            userInfo={`ثبت‌نام با نام ${userData?.firstName} ${userData?.lastName}`}
          />
        )}
      </AuthForm>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default SignupPage;
