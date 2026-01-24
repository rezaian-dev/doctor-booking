import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormInput } from './FormInput';
import { SubmitButton } from './SubmitButton';
import { LoginPhoneInput } from '@/lib/validations/auth';

interface LoginPhoneStepProps {
  register: UseFormRegister<LoginPhoneInput>;
  errors: FieldErrors<LoginPhoneInput>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

/**
 * 📞 Step 1 of login flow: collect user’s phone number
 * 🔢 Optimized for numeric input (type="tel", inputMode="numeric", LTR)
 * 🧩 Composed from reusable form primitives (`FormInput`, `SubmitButton`)
 * ⏳ Visual feedback during submission via `isSubmitting` state
 */
export const LoginPhoneStep = ({
  register,
  errors,
  isSubmitting,
  onSubmit,
}: LoginPhoneStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-2.5 md:space-y-5">
      {/* 📱 Phone input with Persian label + LTR numeric entry */}
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

      {/* ▶️ Submit button with loading state */}
      <div className="mt-2">
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="در حال ارسال..."
          buttonText="ارسال کد تأیید"
        />
      </div>
    </form>
  );
};
