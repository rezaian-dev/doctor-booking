'use client';
import { Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarUpload } from '@/components/features/profile/avatar-upload';
import { ProfileHeader } from '@/components/features/profile/profile-header';
import { ProfileFormFields } from '@/components/features/profile/profile-form-fields';
import { ProfilePasswordField } from '@/components/features/profile/profile-password-field';
import { SpinnerButton } from '@/components/shared/spinner-button';
import { useProfileForm } from '@/hooks/use-profile-form';
import { UserProfile } from '@/types/patient';

export default function ProfileCard({ initialProfile }: { initialProfile: UserProfile }) {
  const { form, isEdit, setIsEdit, loading, avatar, setAvatar, handleCancel, onSubmit } =
    useProfileForm(initialProfile);

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
          <AvatarUpload
            firstName={watch('firstName')}
            isEditMode={isEdit}
            previewUrl={avatar.preview}
            onImageSelect={(file) => setAvatar({ file, preview: URL.createObjectURL(file), shouldDelete: false })}
            onImageRemove={() => setAvatar({ file: null, preview: '', shouldDelete: true })}
          />
          <ProfileFormFields
            register={register} setValue={setValue} watch={watch}
            errors={errors} isEditMode={isEdit}
          />
          {isEdit && (
            <>
              <ProfilePasswordField register={register} errors={errors} />
              <div className="flex justify-center pt-4">
                <SpinnerButton
                  loading={loading}
                  loadingText="در حال ذخیره..."
                  icon={<Save className="w-4 h-4" />}
                  size="lg"
                  className="min-w-50 bg-primary-500 hover:bg-primary-600 text-white"
                >
                  ذخیره تغییرات
                </SpinnerButton>
              </div>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
