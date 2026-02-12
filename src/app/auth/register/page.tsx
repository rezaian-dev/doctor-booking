'use client';

import { FC, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SignupInput, signupSchema, OtpInput, otpSchema } from '@/lib/validations/validation-auth';
import { AuthForm } from '@/components/features/auth/auth-form';
import { SignupFormStep } from '@/components/features/auth/signup-form-step';
import { OTPVerificationStep } from '@/components/features/auth/otp-verification-step';
import { Toaster } from 'sonner';
import { useAuth } from '@/lib/providers/auth-provider';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

const RegisterPage: FC = () => {
  const router = useRouter();
  const { mutate } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [userData, setUserData] = useState<SignupInput | null>(null);

  const signupForm = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  });

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

      // ✅ Optimistic navigation
      startTransition(async () => {
        await mutate();
        router.push('/profile');
        router.refresh();
      });
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
    otpForm.reset();

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
        description={step === 'form' ? 'اطلاعات خود را وارد کنید' : 'کد ارسال شده را وارد کنید'}
        footerText="قبلاً ثبت‌نام کرده‌اید؟"
        footerLinkText="وارد شوید"
        footerLinkHref="/auth/login"
      >
        {step === 'form' ? (
          <SignupFormStep
            register={signupForm.register}
            errors={signupForm.formState.errors}
            isSubmitting={signupForm.formState.isSubmitting}
            onSubmit={signupForm.handleSubmit(onSubmitSignup)}
          />
        ) : (
          <OTPVerificationStep
            otpValue={otpForm.watch('otp') || ''}
            onOtpChange={(value) => otpForm.setValue('otp', value)}
            otpError={otpForm.formState.errors.otp?.message}
            isSubmitting={otpForm.formState.isSubmitting || isPending}
            onSubmit={otpForm.handleSubmit(onSubmitOtp)}
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

export default RegisterPage;
