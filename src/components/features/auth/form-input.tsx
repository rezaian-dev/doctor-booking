import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  register: UseFormRegisterReturn;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric';
  dir?: 'ltr' | 'rtl';
  maxLength?: number;
  className?: string;
}

/**
 * 🧾 Reusable controlled input with label & validation
 * ✅ Auto-bound to react-hook-form via `register`
 * 🚫 Prevents layout shift with fixed error container height
 * 🌐 RTL/LTR & inputMode support for international UX
 * 🎨 Consistent styling via shared `Input` component
 */
export const FormInput = ({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  register,
  inputMode,
  dir,
  maxLength,
  className,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        inputMode={inputMode}
        dir={dir}
        maxLength={maxLength}
        className={className}
        {...register}
      />

      {/* ⚠️ Fixed-height error container to avoid layout jumps */}
      <div className="h-6 mt-2">
        {error && (
          <p className="text-danger-500 text-xs md:text-sm animate-fade-in">{error}</p>
        )}
      </div>
    </div>
  );
};
