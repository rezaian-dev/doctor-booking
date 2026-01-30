'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  OtpInput,
  otpSchema,
  SignupInput,
  signupSchema,
} from '@/lib/validations/validation-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster, toast } from 'sonner';
import { AuthForm } from '@/components/features/auth/auth-form';
import { SignupFormStep } from '@/components/features/auth/signup-form-step';
import { OTPVerificationStep } from '@/components/features/auth/otp-verification-step';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

/**
 * 📝 Two-step signup: Form → OTP → Profile
 * ✅ Fixed resend throttling (30sec cooldown)
 * ✅ Clear OTP when going back to form
 * ✅ Reset throttle timer on back to form
 */
const Page: FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [userData, setUserData] = useState<SignupInput | null>(null);

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup, isSubmitting: isSubmittingSignup },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema) as any,
  });

  const {
    setValue: setOtpValue,
    watch: watchOtp,
    handleSubmit: handleSubmitOtp,
    reset: resetOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema) as any,
  });

  const otpValue = watchOtp('otp') || '';

  const apiCall = async (url: string, data: unknown) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result;
  };

  const onSubmitSignup = async (data: SignupInput) => {
    try {
      await apiCall('/api/auth/register', data);
      setUserData(data);
      setStep('otp');
      toast.success('کد تایید ارسال شد');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ثبت‌نام');
    }
  };

  const onSubmitOtp = async (data: OtpInput) => {
    try {
      await apiCall('/api/auth/verify-otp', { ...userData, otp: data.otp });
      toast.success('ثبت‌نام موفق!');
      router.replace('/profile');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'کد نادرست');
    }
  };

  const handleResendOtp = async () => {
    if (!userData) {
      toast.error('اطلاعات کاربر یافت نشد');
      return;
    }

    try {
      await apiCall('/api/auth/register', userData);
      toast.success('کد جدید ارسال شد');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ارسال');
    }
  };

  const handleBackToForm = async () => {
    resetOtp(); // 🧹 پاک کردن مقدار OTP

    // 🔄 Reset throttle timer on server
    if (userData?.phone) {
      try {
        await fetch('/api/auth/reset-throttle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: userData.phone }),
        });
      } catch (error) {
        console.error('Failed to reset throttle:', error);
      }
    }

    setStep('form');
  };

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
            onOtpChange={value => setOtpValue('otp', value)}
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

export default Page;
