import { useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PersianDatePicker } from './persian-date-picker';
import { cn } from '@/lib/utils/cn';
import { ProfileFormData } from '@/lib/validations/profile.zod';

type FormFieldProps = {
  name: keyof ProfileFormData;
  label: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'select' | 'datepicker';
  maxLength?: number;
  placeholder?: string;
  hint?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (v: string) => void;
  register?: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isEditMode: boolean;
};

export function FormField({
  name,
  label,
  required,
  type = 'text',
  maxLength,
  placeholder,
  hint,
  options,
  value,
  onChange,
  register,
  errors,
  isEditMode,
}: FormFieldProps) {
  const [show, setShow] = useState(false);
  const error = errors[name];

  // 📋 Select dropdown
  if (type === 'select') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </Label>
        <Select value={value || ''} onValueChange={onChange} disabled={!isEditMode}>
          <SelectTrigger className={cn(!isEditMode && 'bg-gray-50 cursor-not-allowed')}>
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            {options?.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="h-5">
          {error && <p className="text-xs text-red-500 transition-opacity duration-200">{error.message as string}</p>}
        </div>
      </div>
    );
  }

  // 📅 Date picker
  if (type === 'datepicker') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </Label>
        <PersianDatePicker value={value} onChange={onChange!} disabled={!isEditMode} />
        <div className="h-5">
          {error && <p className="text-xs text-red-500 transition-opacity duration-200">{error.message as string}</p>}
        </div>
      </div>
    );
  }

  // 🔐 Password field
  if (type === 'password') {
    return (
      <div className="space-y-2">
        <Label>
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
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
            onClick={() => setShow(!show)}
            variant="ghost"
            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <div className="h-5">
          {hint && !error && <p className="text-xs text-neutral-500 transition-opacity duration-200">{hint}</p>}
          {error && <p className="text-xs text-red-500 transition-opacity duration-200">{error.message as string}</p>}
        </div>
      </div>
    );
  }

  // 📝 Text/Email input
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </Label>
      <Input
        {...(register ? register(name) : {})}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={!isEditMode}
        className={cn(!isEditMode && 'bg-gray-50 cursor-not-allowed')}
      />
      <div className="h-5">
        {error && <p className="text-xs text-red-500 transition-opacity duration-200">{error.message as string}</p>}
      </div>
    </div>
  );
}
