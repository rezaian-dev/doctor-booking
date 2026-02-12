'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/providers/auth-provider';
import { UserProfile } from '@/types/profile-types';
import { profileSchema } from '@/lib/validations/validation-profile';

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

  // ❌ Cancel and reset
  const handleCancel = () => {
    form.reset(initialProfile);
    setAvatar({
      file: null,
      preview: initialProfile.imageUrl || '',
      shouldDelete: false,
    });
    setIsEdit(false);
  };

  // 🔐 Check authentication before making request
  const checkAuth = (): boolean => {
    if (!isAuthenticated || !user) {
      toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید');
      router.push('/login');
      return false;
    }
    return true;
  };

  // 📤 Upload avatar with auth check
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
      toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید');
      router.push('/login');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'آپلود تصویر ناموفق بود');
    }

    const data = await res.json();
    return data.avatar;
  };

  // 🗑️ Delete avatar with auth check
  const deleteAvatar = async (): Promise<void> => {
    if (!checkAuth()) throw new Error('Unauthorized');

    const res = await fetch('/api/profile/upload-avatar', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status === 401) {
      toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید');
      router.push('/login');
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'حذف تصویر ناموفق بود');
    }
  };

  // 💾 Submit handler with comprehensive error handling
  const onSubmit = form.handleSubmit((data) => {
    if (!checkAuth()) return;

    startTransition(async () => {
      try {
        let newAvatar = initialProfile.imageUrl || '';

        // 🖼️ Handle avatar changes
        try {
          if (avatar.shouldDelete) {
            await deleteAvatar();
            newAvatar = '';
          } else if (avatar.file) {
            newAvatar = await uploadAvatar(avatar.file);
          }
        } catch (avatarError: any) {
          if (avatarError.message === 'Unauthorized') return;
          console.error('Avatar error:', avatarError);
          toast.error(avatarError.message || 'خطا در پردازش تصویر');
        }

        // 📝 Update profile data
        const res = await fetch('/api/profile', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        // 🚨 Handle authentication error
        if (res.status === 401) {
          toast.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید');
          router.push('/login');
          return;
        }

        if (!res.ok) {
          const error = await res.json();

          if (res.status === 409) {
            if (error.field === 'phone') {
              toast.error('شماره موبایل قبلاً ثبت شده است');
            } else if (error.field === 'email') {
              toast.error('ایمیل قبلاً ثبت شده است');
            } else {
              toast.error(error.error || 'خطا در به‌روزرسانی');
            }
            return;
          }

          if (res.status === 400) {
            toast.error(error.error || 'اطلاعات وارد شده نامعتبر است');
            return;
          }

          throw new Error(error.error || 'خطا در به‌روزرسانی پروفایل');
        }

        const { user: updatedUser } = await res.json();

        // ⚡ Optimistic update auth context
        updateUser({
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatar: newAvatar || undefined,
        });

        // 🔄 Revalidate profile cache
        await mutate('/api/profile');

        toast.success('پروفایل با موفقیت به‌روزرسانی شد');
        setIsEdit(false);
        setAvatar({ file: null, preview: newAvatar, shouldDelete: false });
      } catch (error: any) {
        console.error('Profile update error:', error);

        if (error.message !== 'Unauthorized') {
          toast.error(error.message || 'خطا در به‌روزرسانی پروفایل');
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
