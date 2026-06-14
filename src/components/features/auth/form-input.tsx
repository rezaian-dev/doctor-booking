import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface FormInputProps {
  id:          string;
  label:       string;
  type?:       string;
  placeholder: string;
  error?:      string | undefined;
  register:    UseFormRegisterReturn;
  inputMode?:  'text' | 'tel' | 'email' | 'numeric';
  dir?:        'ltr' | 'rtl';
  maxLength?:  number;
  className?:  string;
}

/**
 * 🧾 Reusable input with label + validation error
 * ✅ Error shown via opacity transition — zero layout shift
 * ✅ Reserved h-5 slot always present, text fades in/out
 */
export const FormInput = ({
  id, label, type = 'text', placeholder,
  error, register, inputMode, dir, maxLength, className,
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
        aria-describedby={`${id}-error`}
        inputMode={inputMode}
        dir={dir}
        maxLength={maxLength}
        className={className}
        {...register}
      />
      {/* ⚠️ Always-present slot — opacity animates, height never changes */}
      <p
        id={`${id}-error`}
        role="alert"
        aria-live="polite"
        className="h-5 mt-1.5 text-xs text-danger-500 transition-opacity duration-200"
        style={{ opacity: error ? 1 : 0 }}
      >
        {error ?? '\u200c'}
      </p>
    </div>
  );
};
