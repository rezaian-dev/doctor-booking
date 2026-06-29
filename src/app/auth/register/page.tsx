'use client';

import { FC, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mutate } from 'swr'; // 🔄 warm the shared /api/auth/me cache
import { toast } from 'sonner';
import { RegisterInput, registerSchema, OtpInput, otpSchema } from '@/lib/validations/auth';
import { notifyAuthChange } from '@/lib/auth/session-hint'; // 📣 flip the header live
import { toEnDigits } from '@/lib/utils/persian-format';
import { AuthForm } from '@/components/features/auth/auth-form';
import { SignupFormStep } from '@/components/features/auth/signup-form-step';
import { OTPVerificationStep } from '@/components/features/auth/otp-verification-step';

type Step = 'form' | 'otp';

// 🧾 Error payload surfaced by the API (attempts + resend hint)
type ApiErrorData = { attemptsLeft?: number; requireResend?: boolean };

const Page: FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>('form');
  const [userData, setUserData] = useState<RegisterInput | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  const signupForm = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const otpForm = useForm<OtpInput>({ resolver: zodResolver(otpSchema) });

  // 🧲 Compiler-safe reactive reads — useWatch/useFormState are memoizable, whereas watch()
  //    + the formState proxy make React Compiler skip memoizing this component. ⚡
  const otpValue = useWatch({ control: otpForm.control, name: 'otp' });
  const signupState = useFormState({ control: signupForm.control });
  const otpState = useFormState({ control: otpForm.control });

  // 🌐 Generic POST helper — throws on non-2xx, attaching the JSON body so callers
  //    can read structured fields (attemptsLeft, requireResend) alongside the message.
  const post = async (url: string, data: unknown) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(json.error || 'خطا در سرور') as Error & { data?: ApiErrorData };
      err.data = json;
      throw err;
    }
    return json;
  };

  // 📝 Step 1 — submit registration, then move to OTP
  const handleSignup = async (data: RegisterInput) => {
    try {
      await post('/api/auth/register', data);
      setUserData(data);
      setAttemptsLeft(null);
      setStep('otp');
      toast.success('کد تأیید ارسال شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    }
  };

  // ✅ Step 2 — verify the OTP and enter the app
  const handleVerify = async (data: OtpInput) => {
    if (!userData) return;
    try {
      await post('/api/auth/verify-otp', { ...userData, otp: data.otp });
      setAttemptsLeft(null);
      toast.success('حساب ایجاد شد');
      // 🧹 Clear any stale cached profile + refetch BEFORE notifying → header shows skeleton→avatar,
      //    never misreads a stale { user: null } as a guest. Same root-cause guard as login. 🧠✨
      mutate('/api/auth/me', undefined, { revalidate: true });
      // 🧼 Also drop any stale cached /profile data so the new account never inherits it —
      //    refetches fresh on /profile mount → fully realtime, no manual reload. 🧠✨
      mutate('/api/profile', undefined, { revalidate: false });
      notifyAuthChange();
      // 🚀 Soft nav only — router.refresh() forced a full Server-Component re-render/flash.
      startTransition(() => {
        router.push('/profile');
      });
    } catch (err) {
      const info = (err as { data?: ApiErrorData }).data;
      toast.error(err instanceof Error ? err.message : 'خطا');
      if (info?.requireResend) {
        // 🧹 Code is gone — clear the field and nudge the user to request a new one
        otpForm.reset();
        setAttemptsLeft(null);
      } else if (typeof info?.attemptsLeft === 'number') {
        setAttemptsLeft(info.attemptsLeft);
      }
    }
  };

  // 🔁 Resend OTP via dedicated endpoint — skips duplicate/ban checks
  //    that belong only to the initial registration step.
  const handleResend = async () => {
    if (!userData) return;
    try {
      await post('/api/auth/resend-otp', { phone: userData.phone });
      otpForm.reset();
      setAttemptsLeft(null);
      toast.success('کد جدید ارسال شد');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'خطا');
    }
  };

  return (
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
          errors={signupState.errors}
          isSubmitting={signupState.isSubmitting}
          onSubmit={signupForm.handleSubmit(handleSignup)}
        />
      ) : (
        <OTPVerificationStep
          otpValue={otpValue ?? ''}
          // 🔢 Normalize to ASCII digits only → identical hash regardless of keyboard
          onOtpChange={(v) =>
            otpForm.setValue('otp', toEnDigits(v).replace(/\D/g, '').slice(0, 5), {
              shouldValidate: true,
            })
          }
          otpError={otpState.errors.otp?.message ?? ''}
          attemptsLeft={attemptsLeft}
          isSubmitting={otpState.isSubmitting || isPending}
          onSubmit={otpForm.handleSubmit(handleVerify)}
          onResend={handleResend}
          onBack={() => {
            otpForm.reset();
            setAttemptsLeft(null);
            setStep('form');
          }}
          phoneNumber={userData?.phone || ''}
          userInfo={`ثبت‌نام با نام ${userData?.firstName} ${userData?.lastName}`}
        />
      )}
    </AuthForm>
  );
};

export default Page;
