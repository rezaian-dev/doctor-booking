'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactSchema } from '@/lib/validations/contactSchema';
import SuccessMessage from '@/components/templates/contact-us/SuccessMessage';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/templates/contact-us/FormSelect';
import FormTextarea from '@/components/templates/contact-us/FormTextarea';
import SubmitButton from '@/components/templates/contact-us/SubmitButton';
import clsx from 'clsx';

// 💬 Form data interface — explicit & type-safe
interface FormData {
  fullName: string;
  requestType: string;
  email: string;
  phone: string;
  message: string;
}

// 📋 Predefined request options for consistent UX
const REQUEST_TYPES = [
  { value: '', label: 'مثال: پشتیبانی' },
  { value: 'appointment', label: 'نوبت‌دهی' },
  { value: 'consultation', label: 'مشاوره' },
  { value: 'support', label: 'پشتیبانی' },
  { value: 'complaint', label: 'شکایت' },
  { value: 'other', label: 'سایر موارد' },
];

// 📝 Contact form with zero layout shift & smooth UX
const ContactForm: FC = () => {
  // ⏳ UI states for loading & feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 🧠 Form logic with Yup validation & real-time error tracking
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(contactSchema),
    mode: 'onChange',
  });

  // 🚀 Handle submission with mock API delay
  const onSubmit = async (FormData: FormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // ⏱️ Simulate network
    console.log('📧 Form Data:', FormData);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    // ✅ Auto-reset after showing success
    setTimeout(() => {
      setSubmitSuccess(false);
      reset();
    }, 3000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[668px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        فرم ثبت بازخورد و درخواست
      </h2>
      <p className="text-gray-600 mb-8">
        در صورت نیاز به ارتباط فوری، از تماس تلفنی استفاده کنید.
      </p>

      {/* ✅ Success banner — always in DOM, no layout shift */}
      <div
        className={clsx(
          'mb-1 transition-opacity  duration-300',
          submitSuccess ? 'block' : 'hidden'
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <SuccessMessage />
      </div>

      {/* 📤 Form — always present, visually toggled */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          'space-y-3 transition-opacity duration-300',
          submitSuccess ? 'opacity-0 invisible' : 'opacity-100 visible'
        )}
        aria-hidden={submitSuccess}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            variant="contact"
            label="نام و نام خانوادگی"
            placeholder="علی محمدی"
            error={errors.fullName}
            {...register('fullName')}
          />
          <FormSelect
            label="نوع درخواست"
            options={REQUEST_TYPES}
            error={errors.requestType}
            {...register('requestType')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            variant="contact"
            type="email"
            label="ایمیل"
            placeholder="email@gmail.com"
            dir="ltr"
            error={errors.email}
            {...register('email')}
          />
          <FormInput
            variant="contact"
            type="tel"
            label="شماره تماس"
            placeholder="09123456789"
            dir="ltr"
            error={errors.phone}
            {...register('phone')}
          />
        </div>

        <FormTextarea
          label="متن"
          placeholder="متن نمونه"
          rows={5}
          error={errors.message}
          {...register('message')}
        />

        {/* 🚦 Submit button with loading state */}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default ContactForm;
