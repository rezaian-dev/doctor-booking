'use client';

import { FC, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LoginPhoneInput, loginPhoneSchema } from '@/lib/validations/validation-auth';
import { AuthForm } from '@/components/features/auth/auth-form';
import { LoginPhoneStep } from '@/components/features/auth/login-phone-step';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from '@/lib/providers/auth-provider';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

const LoginPage: FC = () => {
  const router = useRouter();
  const { mutate } = useAuth();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPhoneInput>({
    resolver: zodResolver(loginPhoneSchema),
  });

  const onSubmit = async (data: LoginPhoneInput) => {
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

      // ✅ Optimistic navigation با revalidation
      startTransition(async () => {
        await mutate(); // ✅ به‌روزرسانی فوری user
        router.push('/profile');
        router.refresh(); // ✅ server-side revalidation
      });
    } catch (error) {
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
          register={register}
          errors={errors}
          isSubmitting={isSubmitting || isPending}
          onSubmit={handleSubmit(onSubmit)}
        />
      </AuthForm>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default LoginPage;
