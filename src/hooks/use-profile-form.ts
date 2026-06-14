'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { profileSchema } from '@/lib/validations/profile';
import { UserProfile } from '@/types/patient';

interface AvatarState {
  file: File | null;
  preview: string;
  shouldDelete: boolean;
}

// 🚪 Thrown after a 401 so callers can bail out without re-toasting
const UNAUTHORIZED = 'Unauthorized';

// 📥 Extract `{ error }` from a failed response, falling back to a default message
async function readError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return data?.error || fallback;
}

export function useProfileForm(initialProfile: UserProfile) {
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isPending, startTransition] = useTransition();

  const blankAvatar = (preview = initialProfile.imageUrl || ''): AvatarState => ({
    file: null,
    preview,
    shouldDelete: false,
  });

  const [avatar, setAvatar] = useState<AvatarState>(blankAvatar);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfile,
  });

  // 🔒 Centralized session-expired handling (toast + redirect)
  const sessionExpired = () => {
    toast.error('نشست منقضی شده است');
    router.push('/auth/login');
  };

  const handleCancel = () => {
    form.reset(initialProfile);
    setAvatar(blankAvatar());
    setIsEdit(false);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append('avatar', file);
    const res = await fetch('/api/profile/upload-avatar', {
      method: 'POST',
      credentials: 'include',
      body,
    });
    if (res.status === 401) { sessionExpired(); throw new Error(UNAUTHORIZED); }
    if (!res.ok) throw new Error(await readError(res, 'آپلود ناموفق'));
    return (await res.json()).avatar;
  };

  const deleteAvatar = async (): Promise<void> => {
    const res = await fetch('/api/profile/upload-avatar', {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.status === 401) { sessionExpired(); throw new Error(UNAUTHORIZED); }
    if (!res.ok) throw new Error(await readError(res, 'حذف ناموفق'));
  };

  // 🖼️ Resolve the avatar (delete / upload / keep) before saving the profile
  const resolveAvatar = async (): Promise<string> => {
    if (avatar.shouldDelete) { await deleteAvatar(); return ''; }
    if (avatar.file) return uploadAvatar(avatar.file);
    return initialProfile.imageUrl || '';
  };

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        let newAvatar = initialProfile.imageUrl || '';
        try {
          newAvatar = await resolveAvatar();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'خطا در پردازش تصویر';
          if (msg === UNAUTHORIZED) return;
          toast.error(msg);
        }

        const res = await fetch('/api/profile', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.status === 401) { sessionExpired(); return; }
        if (res.status === 409) {
          const { field, error } = await res.json();
          const conflict =
            field === 'phone' ? 'این شمارهٔ موبایل قبلاً ثبت شده است.'
            : field === 'email' ? 'این ایمیل قبلاً ثبت شده است.'
            : error || 'خطایی رخ داده است.';
          toast.error(conflict);
          return;
        }
        if (!res.ok) throw new Error(await readError(res, 'خطا در به‌روزرسانی'));

        // 🔄 Revalidate the profile page AND the header payload (/api/auth/me) so the
        //    avatar + name in the header update live — no manual refresh. ✨
        await Promise.all([mutate('/api/profile'), mutate('/api/auth/me')]);
        router.refresh(); // ✅ Re-sync server components with the new data

        toast.success('پروفایل به‌روزرسانی شد');
        setIsEdit(false);
        setAvatar(blankAvatar(newAvatar));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'خطا';
        if (msg !== UNAUTHORIZED) toast.error(msg);
      }
    });
  });

  return { form, isEdit, setIsEdit, loading: isPending, avatar, setAvatar, handleCancel, onSubmit };
}
