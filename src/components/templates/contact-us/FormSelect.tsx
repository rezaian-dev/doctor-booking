import { forwardRef, SelectHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';

// 📥 Select input with validation — stable layout & clean UX
interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: FieldError;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300',
            className
          )}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {/* 🛡️ Error message with reserved space — zero layout shift */}
        <div
          className={clsx(
            'mt-1 min-h-[21px] flex items-start transition-opacity duration-200',
            error
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="text-sm text-red-600">
            ⚠️ {error?.message}
          </p>
        </div>
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;
