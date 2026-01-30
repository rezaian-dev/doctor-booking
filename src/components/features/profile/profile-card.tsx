'use client';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarUpload } from '@/components/features/profile/avatar-upload';
import { ProfileHeader } from '@/components/features/profile/profile-header';
import { ProfileFormFields } from '@/components/features/profile/profile-form-fields';
import { ProfilePasswordField } from '@/components/features/profile/profile-password-field';
import { ProfileSubmitButton } from '@/components/features/profile/profile-submit-button';
import { useProfileForm } from '@/hooks/use-profile-form';
import { UserProfile } from '@/types/profile-types';

type Props = {
  initialProfile: UserProfile;
};

export default function ProfileCard({ initialProfile }: Props) {
  const {
    form,
    isEdit,
    setIsEdit,
    loading,
    profile,
    avatar,
    setAvatar,
    handleCancel,
    onSubmit,
  } = useProfileForm(initialProfile);

  const { register, setValue, watch, formState: { errors } } = form;

  return (
    <Card className="shadow-lg">
      <ProfileHeader
        isEditMode={isEdit}
        onEditToggle={() => setIsEdit(true)}
        onCancel={handleCancel}
      />

      <CardContent className="p-6 md:p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* 📸 Avatar */}
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

          {/* 📝 Form Fields */}
          <ProfileFormFields
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
            isEditMode={isEdit}
          />

          {/* 🔐 Password Field (only in edit mode) */}
          {isEdit && (
            <>
              <ProfilePasswordField register={register} errors={errors} />

              {/* 💾 Submit Button */}
              <ProfileSubmitButton loading={loading} />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
