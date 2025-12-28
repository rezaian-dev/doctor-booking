import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';

// 🎯 Props interface - clean & type-safe
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
  variant?: 'profile' | 'contact';
  icon?: React.ReactNode;
  direction?: 'ltr' | 'rtl';
  containerClassName?: string;
}

// 🎨 Style configurations by variant
const VARIANT_STYLES = {
  profile: {
    container: 'space-y-1',
    label: 'text-sm text-gray-700 font-medium mb-2 inline-block',
    input: 'w-full h-10 rounded-md border px-3 text-sm focus:ring-2 outline-none transition-colors',
    errorText: 'text-xs text-red-500'
  },
  contact: {
    container: 'space-y-2',
    label: 'text-sm text-gray-700 font-medium mb-2 inline-block',
    input: 'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all',
    errorText: 'text-sm text-red-600'
  }
} as const;

// 🔵 Main component
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      variant = 'contact',
      icon,
      direction = 'rtl',
      containerClassName,
      className,
      required = true,
      ...props
    },
    ref
  ) => {
    const styles = VARIANT_STYLES[variant];

    // 📐 Computed classes
    const inputClasses = clsx(
      styles.input,
      direction === 'ltr' ? 'text-left' : 'text-right',
      icon && (direction === 'ltr' ? 'pl-10' : 'pr-10'),
      error ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-blue-500',
      className
    );

    const iconClasses = clsx(
      'absolute top-1/2 -translate-y-1/2 text-gray-400',
      direction === 'ltr' ? 'left-3' : 'right-3'
    );

    return (
      <div className={clsx(styles.container, containerClassName)}>
        {/* 🏷️ Label */}
        <label className={styles.label}>
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>

        {/* 📝 Input wrapper */}
        <div className="relative">
          {icon && <span className={iconClasses}>{icon}</span>}
          <input ref={ref} dir={direction} className={inputClasses} {...props} />
        </div>

        {/* ⚠️ Error message - no layout shift */}
        <div
          className={clsx('min-h-[21px] transition-opacity duration-200', error ? 'opacity-100' : 'opacity-0')}
          aria-live="polite"
        >
          {error && (
            <p className={clsx(styles.errorText, 'flex items-center gap-1')}>
              <span>⚠️</span>
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
