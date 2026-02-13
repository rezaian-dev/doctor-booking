'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { profileSchema } from '@/lib/validations/profile.zod';
import { UserProfile } from '@/types/patient';

interface AvatarState {
  file: File | null;
  preview: string;
  shouldDelete: boolean;
}

export function useProfileForm(initialProfile: UserProfile) {
  const { updateUser, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<AvatarState>({
    file: null,
    preview: initialProfile.imageUrl || '',
    shouldDelete: false,
  });

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfile,
  });

  // ❌ Reset form state
  const handleCancel = () => {
    form.reset(initialProfile);
    setAvatar({
      file: null,
      preview: initialProfile.imageUrl || '',
      shouldDelete: false,
    });
    setIsEdit(false);
  };

  // 🔐 Validate user session
  const checkAuth = (): boolean => {
    if (!isAuthenticated || !user) {
      toast.error('نشست منقضی شده است');
      router.push('/login');
      return false;
    }
    return true;
  };

  // 📤 Upload avatar to server
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!checkAuth()) throw new Error('Unauthorized');

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('/api/profile/upload-avatar', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (res.status === 401) {
      toast.error('نشست منقضی شده است');
      router.push('/login');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'آپلود ناموفق');
    }

    const data = await res.json();
    return data.avatar;
  };

  // 🗑️ Delete avatar from server
  const deleteAvatar = async (): Promise<void> => {
    if (!checkAuth()) throw new Error('Unauthorized');

    const res = await fetch('/api/profile/upload-avatar', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status === 401) {
      toast.error('نشست منقضی شده است');
      router.push('/login');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'حذف ناموفق');
    }
  };

  // 💾 Submit profile updates
  const onSubmit = form.handleSubmit((data) => {
    if (!checkAuth()) return;

    startTransition(async () => {
      try {
        let newAvatar = initialProfile.imageUrl || '';

        // 🖼️ Process avatar changes
        try {
          if (avatar.shouldDelete) {
            await deleteAvatar();
            newAvatar = '';
          } else if (avatar.file) {
            newAvatar = await uploadAvatar(avatar.file);
          }
        } catch (avatarError: any) {
          if (avatarError.message === 'Unauthorized') return;
          toast.error(avatarError.message || 'خطا در پردازش تصویر');
        }

        // 📝 Update profile data
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        // 🚨 Handle auth errors
        if (res.status === 401) {
          toast.error('نشست منقضی شده است');
          router.push('/login');
          return;
        }

        if (!res.ok) {
          const error = await res.json();

          if (res.status === 409) {
            toast.error(
              error.field === 'phone'
                ? 'این شمارهٔ موبایل قبلاً ثبت شده است.'
                : error.field === 'email'
                  ? 'این ایمیل قبلاً ثبت شده است.'
                  : error.error || 'خطایی رخ داده است.'
            );
            return;
          }

          if (res.status === 400) {
            toast.error(error.error || 'داده نامعتبر');
            return;
          }

          throw new Error(error.error || 'خطا در به‌روزرسانی');
        }

        const { user: updatedUser } = await res.json();

        // ⚡ Update auth context optimistically
        updateUser({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: newAvatar || undefined,
        });

        // 🔄 Revalidate profile cache
        await mutate('/api/profile');

        toast.success('پروفایل به‌روزرسانی شد');
        setIsEdit(false);
        setAvatar({ file: null, preview: newAvatar, shouldDelete: false });
      } catch (error: any) {
        if (error.message !== 'Unauthorized') {
          toast.error(error.message || 'خطا');
        }
      }
    });
  });

  return {
    form,
    isEdit,
    setIsEdit,
    loading: isPending,
    avatar,
    setAvatar,
    handleCancel,
    onSubmit,
  };
}
