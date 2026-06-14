'use client';

import { FC, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mutate } from 'swr'; // 🔄 warm the shared /api/auth/me cache
import { toast } from 'sonner';
import { LoginPhoneInput, loginPhoneSchema } from '@/lib/validations/auth';
import { notifyAuthChange } from '@/lib/auth/session-hint'; // 📣 flip the header live
import { AuthForm } from '@/components/features/auth/auth-form';
import { LoginPhoneStep } from '@/components/features/auth/login-phone-step';

const Page: FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginPhoneInput>({
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

      toast.success('ورود موفق!');
      // 🔐 Redirect to callbackUrl if present, otherwise profile. Read it from the URL inside the
      //    handler (client-only) instead of useSearchParams() during render → no dynamic bailout,
      //    so /auth/login stays STATICALLY prerendered = instant soft nav, zero flash. 🧠✨
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/profile';
      // 🧹 Drop any stale cached profile (e.g. a { user: null } left by a prior logout) and
      //    refetch, THEN notify. The header reads "unknown" → skeleton → avatar, and can never
      //    misread a stale null as a guest. Root-cause guard for the second-login bug. 🧠✨
      mutate('/api/auth/me', undefined, { revalidate: true });
      notifyAuthChange();
      // 🚀 Soft nav only — router.refresh() re-ran Server Components and caused a full re-render/flash.
      startTransition(() => {
        router.push(callbackUrl);
      });
    } catch {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  return (
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
  );
};

export default Page;
