import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from './form-input';
import { SubmitButton } from './submit-button';
import { LoginPhoneInput } from '@/lib/validations/validation-auth';

interface LoginPhoneStepProps {
  register: UseFormRegister<LoginPhoneInput>;
  errors: FieldErrors<LoginPhoneInput>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * 📞 Login flow: phone and password
 */
export const LoginPhoneStep = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
}: LoginPhoneStepProps) => {
  return (
    <form onSubmit={onSubmit}>
      {/* Phone */}
      <FormInput
        id="phone"
        label="شماره موبایل"
        type="tel"
        inputMode="numeric"
        dir="ltr"
        placeholder="09123456789"
        maxLength={11}
        className="text-left"
        error={errors.phone?.message}
        register={register('phone')}
      />

      {/* Password */}
      <FormInput
        id="password"
        label="رمز عبور"
        type="password"
        placeholder="رمز عبور خود را وارد کنید"
        error={errors.password?.message}
        register={register('password')}
      />

      {/* Submit */}
      <div className="mt-2">
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="در حال ورود..."
          buttonText="ورود"
        />
      </div>
    </form>
  );
};
