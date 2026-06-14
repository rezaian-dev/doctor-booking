'use client';

import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input }    from '@/components/ui/input';
import { Label }    from '@/components/ui/label';
import { Button }   from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersianDatePicker } from './persian-date-picker';
import { cn } from '@/lib/utils/cn';
import { ProfileFormData } from '@/lib/validations/profile';

type FormFieldProps = {
  name:        keyof ProfileFormData;
  label:       string;
  required?:   boolean | undefined;
  type?:       'text' | 'email' | 'password' | 'select' | 'datepicker' | undefined;
  maxLength?:  number | undefined;
  placeholder?: string | undefined;
  hint?:       string | undefined;
  options?:    { value: string; label: string }[] | undefined;
  value?:      string | undefined;
  onChange?:   ((v: string) => void) | undefined;
  register?:   UseFormRegister<ProfileFormData> | undefined;
  errors:      FieldErrors<ProfileFormData>;
  isEditMode:  boolean;
};

// ⚠️ Always-present error/hint row — opacity animates, height never shifts layout
function FieldMsg({ error, hint }: { error?: string | undefined; hint?: string | undefined }) {
  const text    = error ?? hint ?? '\u200c';
  const visible = !!(error || hint);
  return (
    <p
      role="alert"
      aria-live="polite"
      className={cn(
        'h-5 text-xs transition-opacity duration-200',
        error ? 'text-danger-500' : 'text-neutral-500'
      )}
      style={{ opacity: visible ? 1 : 0 }}
    >
      {text}
    </p>
  );
}

export function FormField({
  name, label, required, type = 'text',
  maxLength, placeholder, hint, options,
  value, onChange, register, errors, isEditMode,
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const error = errors[name]?.message as string | undefined;

  // 📋 Select
  if (type === 'select') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-danger-500 mr-1">*</span>}
        </Label>
        <Select value={value || ''} {...(onChange && { onValueChange: onChange })} disabled={!isEditMode}>
          <SelectTrigger className={cn(!isEditMode && 'bg-neutral-50 cursor-not-allowed')}>
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {options?.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldMsg error={error} hint={hint} />
      </div>
    );
  }

  // 📅 Date picker
  if (type === 'datepicker') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-danger-500 mr-1">*</span>}
        </Label>
        <PersianDatePicker value={value} onChange={onChange!} disabled={!isEditMode} />
        <FieldMsg error={error} hint={hint} />
      </div>
    );
  }

  // 🔐 Password
  if (type === 'password') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-danger-500 mr-1">*</span>}
        </Label>
        <div className="relative">
          <Input
            {...(register ? register(name) : {})}
            type={show ? 'text' : 'password'}
            placeholder={placeholder}
            className="pl-10"
            disabled={!isEditMode}
          />
          <Button
            type="button"
            onClick={() => setShow(s => !s)}
            variant="ghost"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            tabIndex={-1}
            aria-label={show ? 'مخفی کردن رمز' : 'نمایش رمز'}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <FieldMsg error={error} hint={hint} />
      </div>
    );
  }

  // 📝 Text / Email
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-danger-500 mr-1">*</span>}
      </Label>
      <Input
        {...(register ? register(name) : {})}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={!isEditMode}
        className={cn(!isEditMode && 'bg-neutral-50 cursor-not-allowed')}
      />
      <FieldMsg error={error} hint={hint} />
    </div>
  );
}
