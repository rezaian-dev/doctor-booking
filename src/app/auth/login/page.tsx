'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  LoginPhoneInput,
  loginPhoneSchema,
} from '@/lib/validations/validation-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

import { AuthForm } from '@/components/features/auth/auth-form';
import { LoginPhoneStep } from '@/components/features/auth/login-phone-step';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

/**
 * 📱 Direct login flow: Phone → Redirect to /profile
 * ✨ Form validation via react-hook-form + yup
 * 🔔 Real-time feedback with sonner toasts
 * ✅ No OTP required - direct login
 */
const Page: FC = () => {
  const router = useRouter();
  // 📞 Phone form setup
  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: errorsPhone, isSubmitting: isSubmittingPhone },
  } = useForm<LoginPhoneInput>({
    resolver: zodResolver(loginPhoneSchema),
  });

  // 📤 Submit phone → API login & redirect
  const onSubmitPhone = async (data: LoginPhoneInput) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'خطا در ورود');
        return;
      }

      toast.success('با موفقیت وارد شدید!');
      setTimeout(() => router.replace('/profile'), 1000);
    } catch {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors expand={false} dir="rtl" />
      <Header />
      <AuthForm
        title="ورود به دکتر رزرو"
        description="شماره موبایل خود را وارد کنید"
        footerText="حساب کاربری ندارید؟"
        footerLinkText="ثبت‌نام کنید"
        footerLinkHref="/auth/register"
      >
        <LoginPhoneStep
          register={registerPhone}
          errors={errorsPhone}
          isSubmitting={isSubmittingPhone}
          onSubmit={handleSubmitPhone(onSubmitPhone)}
        />
      </AuthForm>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default Page;
