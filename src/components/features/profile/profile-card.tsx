'use client';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarUpload } from '@/components/features/profile/avatar-upload';
import { ProfileHeader } from '@/components/features/profile/profile-header';
import { ProfileFormFields } from '@/components/features/profile/profile-form-fields';
import { ProfilePasswordField } from '@/components/features/profile/profile-password-field';
import { ProfileSubmitButton } from '@/components/features/profile/profile-submit-button';

import { UserProfile } from '@/types/profile-types';
import { useProfileForm } from '@/hooks/use-profile-form';

/**
 * 👤 Profile Card Component
 * ✨ Editable user profile with avatar upload
 * 🔄 Real-time sync with auth context via useProfileForm
 */
export default function ProfileCard({ initialProfile }: { initialProfile: UserProfile }) {
  const {
    form,
    isEdit,
    setIsEdit,
    loading,
    avatar,
    setAvatar,
    handleCancel,
    onSubmit,
  } = useProfileForm(initialProfile);

  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <Card className="shadow-lg">
      {/* 🎯 Header with edit/cancel buttons */}
      <ProfileHeader
        isEditMode={isEdit}
        onEditToggle={() => setIsEdit(true)}
        onCancel={handleCancel}
      />

      <CardContent className="p-6 md:p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* 📸 Avatar upload */}
          <AvatarUpload
            firstName={watch('firstName')}
            isEditMode={isEdit}
            previewUrl={avatar.preview}
            onImageSelect={(file) => {
              setAvatar({ file, preview: URL.createObjectURL(file), shouldDelete: false });
            }}
            onImageRemove={() => {
              setAvatar({ file: null, preview: '', shouldDelete: true });
            }}
          />

          {/* 📝 Profile input fields */}
          <ProfileFormFields
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            isEditMode={isEdit}
          />

          {/* 🔐 Password & submit (edit mode only) */}
          {isEdit && (
            <>
              <ProfilePasswordField register={register} errors={errors} />
              <ProfileSubmitButton loading={loading} />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
