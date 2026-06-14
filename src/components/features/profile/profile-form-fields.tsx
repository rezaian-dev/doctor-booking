'use client';

import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { FormField } from './form-field';
import { ProfileFormData } from '@/lib/validations/profile';

const FIELDS = [
  { name: 'firstName' as const, label: 'نام', required: true },
  { name: 'lastName' as const, label: 'نام خانوادگی', required: true },
  { name: 'nationalCode' as const, label: 'کد ملی', maxLength: 10, placeholder: '۱۰ رقم' },
  { name: 'phone' as const, label: 'شماره موبایل', required: true, maxLength: 11 },
  { name: 'email' as const, label: 'ایمیل', type: 'email' as const },
  { name: 'city' as const, label: 'شهر' },
  {
    name: 'gender' as const,
    label: 'جنسیت',
    type: 'select' as const,
    options: [
      { value: 'male', label: 'آقا' },
      { value: 'female', label: 'خانم' },
    ],
  },
  { name: 'birthDate' as const, label: 'تاریخ تولد', type: 'datepicker' as const },
];

type ProfileFormFieldsProps = {
  register: UseFormRegister<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isEditMode: boolean;
};

// 📝 All profile form fields
export function ProfileFormFields({ register, setValue, watch, errors, isEditMode }: ProfileFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FIELDS.map(field => (
        <FormField
          key={field.name}
          name={field.name}
          label={field.label}
          required={field.required}
          type={field.type}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          options={field.options}
          value={field.type === 'select' || field.type === 'datepicker' ? watch(field.name) : undefined}
          onChange={field.type === 'select' || field.type === 'datepicker' ? v => setValue(field.name, v) : undefined}
          register={register}
          errors={errors}
          isEditMode={isEditMode}
        />
      ))}
    </div>
  );
}
