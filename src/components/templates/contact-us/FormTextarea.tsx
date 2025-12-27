import { forwardRef, TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none',
            error
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        {/* 🛡️ Error message with reserved space — no layout shift */}
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
