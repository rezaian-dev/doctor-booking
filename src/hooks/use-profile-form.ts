import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserProfile } from '@/types/profile-types';
import { ProfileFormData, profileSchema } from '@/lib/validations/validation-profile';

type AvatarState = {
  file: File | null;
  preview: string;
  shouldDelete: boolean;
};

export function useProfileForm(initialProfile: UserProfile) {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState<AvatarState>({
    file: null,
    preview: profile.imageUrl || '',
    shouldDelete: false
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      nationalCode: profile.nationalCode || '',
      email: profile.email || '',
      birthDate: profile.birthDate || '',
      gender: profile.gender || '',
      city: profile.city || '',
      password: '',
    }
  });

  const { reset } = form;

  // 🎯 Cancel handler
  const handleCancel = () => {
    reset();
    setAvatar({ file: null, preview: profile.imageUrl || '', shouldDelete: false });
    setIsEdit(false);
  };

  // 📤 Upload avatar
  const uploadAvatar = async (): Promise<string> => {
    if (avatar.shouldDelete) return '';
    if (!avatar.file) return profile.imageUrl || '';

    const fd = new FormData();
    fd.append('file', avatar.file);

    const res = await fetch('/api/profile/upload-avatar', { method: 'POST', body: fd });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'خطا در آپلود تصویر');
    return data.imageUrl;
  };

  // 💾 Submit handler
  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar();

      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        avatar: avatarUrl,
        email: data.email?.trim() || '',
        nationalCode: data.nationalCode?.trim() || '',
        birthDate: data.birthDate || '',
        gender: data.gender || '',
        city: data.city?.trim() || '',
        ...(data.password?.trim() && { password: data.password.trim() })
      };

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'خطا در بروزرسانی');
      }

      // ✅ Map response with proper types
      const updated: UserProfile = {
        firstName: result.user.firstName || '',
        lastName: result.user.lastName || '',
        phone: result.user.phone || '',
        email: result.user.email || '',
        nationalCode: result.user.nationalCode || '',
        birthDate: result.user.birthDate || '',
        gender: (result.user.gender || '') as 'male' | 'female' | '',
        city: result.user.city || '',
        imageUrl: result.user.avatar || '',
      };

      setProfile(updated);
      reset({ ...updated, password: '' });
      setAvatar({ file: null, preview: updated.imageUrl || '', shouldDelete: false });

      toast.success('اطلاعات با موفقیت بروزرسانی شد ✅');
      setIsEdit(false);

    } catch (err: any) {
      toast.error(err.message || 'خطا در بروزرسانی');
    } finally {
      setLoading(false);
    }
  });

  return {
    form,
    isEdit,
    setIsEdit,
    loading,
    profile,
    avatar,
    setAvatar,
    handleCancel,
    onSubmit,
  };
}
