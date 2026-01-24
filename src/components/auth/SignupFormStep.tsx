import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { SignupInput } from '@/lib/validations/auth';

interface SignupFormStepProps {
  register: UseFormRegister<SignupInput>;
  errors: FieldErrors<SignupInput>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * 📝 Step 1: Collect user info (name, phone, email)
 */
export const SignupFormStep = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
}:SignupFormStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-1.5">
      {/* First Name */}
      <FormInput
        id="firstName"
        label="نام"
        placeholder="محمد"
        error={errors.firstName?.message}
        register={register('firstName')}
      />

      {/* Last Name */}
      <FormInput
        id="lastName"
        label="نام خانوادگی"
        placeholder="احمدی"
        error={errors.lastName?.message}
        register={register('lastName')}
      />

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
        register={register('phone', {
          onChange: (e) => {
            // Only allow numeric input
            e.target.value = e.target.value.replace(/\D/g, '');
          },
        })}
      />

      {/* Email */}
      <FormInput
        id="email"
        label="ایمیل"
        type="email"
        dir="ltr"
        placeholder="example@email.com"
        className="text-left"
        error={errors.email?.message}
        register={register('email')}
      />

      {/* Submit Button */}
      <div className="mt-2 md:mt-6">
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="در حال ارسال..."
          buttonText="ادامه و دریافت کد"
        />
      </div>
    </form>
  );
};
