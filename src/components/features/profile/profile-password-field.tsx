import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormField } from './form-field';
import { ProfileFormData } from '@/lib/validations/validation-profile';

type ProfilePasswordFieldProps = {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
};

export function ProfilePasswordField({ register, errors }: ProfilePasswordFieldProps) {
  return (
    <FormField
      name="password"
      label="رمز عبور جدید (اختیاری)"
      type="password"
      placeholder="برای تغییر وارد کنید"
      register={register}
      errors={errors}
      isEditMode={true}
      hint="حداقل ۸ کاراکتر شامل حروف و اعداد"
    />
  );
}
