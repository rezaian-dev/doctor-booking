'use client';

import { FC, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast, Toaster } from 'sonner';
import { RegisterInput, registerSchema, OtpInput, otpSchema } from '@/lib/validations/auth.zod';
import { AuthForm } from '@/components/features/auth/auth-form';
import { SignupFormStep } from '@/components/features/auth/signup-form-step';
import { OTPVerificationStep } from '@/components/features/auth/otp-verification-step';
import { useAuth } from '@/lib/providers/auth-provider';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

type Step = 'form' | 'otp';

 const Page:FC = () => {
  const router = useRouter();
  const { mutate } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>('form');
  const [userData, setUserData] = useState<RegisterInput | null>(null);

  const signupForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const otpForm = useForm<OtpInput>({ resolver: zodResolver(otpSchema) });

  // 🌐 Generic POST request handler
  const post = async (url: string, data: unknown) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'خطا در سرور');
    return json;
  };

  // 📝 Step 1: Submit registration data
  const handleSignup = async (data: RegisterInput) => {
    try {
      await post('/api/auth/register', data);
      setUserData(data);
      setStep('otp');
      toast.success('کد تأیید ارسال شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    }
  };

  // ✅ Step 2: Verify OTP code
  const handleVerify = async (data: OtpInput) => {
    if (!userData) return;
    try {
      await post('/api/auth/verify-otp', { ...userData, otp: data.otp });
      toast.success('حساب ایجاد شد');
      startTransition(async () => {
        await mutate();
        router.push('/profile');
        router.refresh();
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    }
  };

  // 🔁 Resend OTP code
  const handleResend = async () => {
    if (!userData) return;
    try {
      await post('/api/auth/register', userData);
      toast.success('کد مجدداً ارسال شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    }
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
            onSubmit={signupForm.handleSubmit(handleSignup)}
          />
        ) : (
          <OTPVerificationStep
            otpValue={otpForm.watch('otp') || ''}
            onOtpChange={v => otpForm.setValue('otp', v)}
            otpError={otpForm.formState.errors.otp?.message}
            isSubmitting={otpForm.formState.isSubmitting || isPending}
            onSubmit={otpForm.handleSubmit(handleVerify)}
            onResend={handleResend}
            onBack={() => {
              otpForm.reset();
              setStep('form');
            }}
            phoneNumber={userData?.phone || ''}
            userInfo={`ثبت‌نام با نام ${userData?.firstName} ${userData?.lastName}`}
          />
        )}
      </AuthForm>
      <Footer />
      <FooterMobile />
    </>
  );
}

export default Page;
