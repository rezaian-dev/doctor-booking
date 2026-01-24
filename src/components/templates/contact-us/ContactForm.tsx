'use client';

import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactSchema } from '@/lib/validations/contactSchema';
import SuccessMessage from '@/components/templates/contact-us/SuccessMessage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
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
    control,
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
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        فرم ثبت بازخورد و درخواست
      </h2>
      <p className="text-neutral-600 mb-8">
        در صورت نیاز به ارتباط فوری، از تماس تلفنی استفاده کنید.
      </p>

      {/* ✅ Success message */}
      <div
        className={clsx(
          'mb-1 transition-opacity duration-300',
          submitSuccess ? 'block' : 'hidden'
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        <SuccessMessage />
      </div>

      {/* 📝 Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          'space-y-3 transition-opacity duration-300',
          submitSuccess ? 'opacity-0 invisible' : 'opacity-100 visible'
        )}
        aria-hidden={submitSuccess}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 👤 Full Name */}
          <div>
            <label className="text-sm mb-2 inline-block font-medium text-neutral-700">
              نام و نام خانوادگی
            </label>
            <Input
              placeholder="علی محمدی"
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
            <div className="min-h-5 mt-1">
              <p
                className={clsx(
                  'text-xs text-danger-400 transition-opacity duration-200',
                  errors.fullName
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                )}
                aria-live="polite"
              >
                {errors.fullName?.message}
              </p>
            </div>
          </div>

          {/* 📋 Request Type */}
          <div>
            <label className="text-sm mb-2 inline-block font-medium text-neutral-700">
              نوع درخواست
            </label>
            <Controller
              name="requestType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger aria-invalid={!!errors.requestType}>
                    <SelectValue placeholder="مثال: پشتیبانی" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUEST_TYPES.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <div className="min-h-5 mt-1">
              <p
                className={clsx(
                  'text-xs text-danger-400 transition-opacity duration-200',
                  errors.requestType
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                )}
                aria-live="polite"
              >
                {errors.requestType?.message}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 📧 Email */}
          <div>
            <label className="text-sm mb-2 inline-block font-medium text-neutral-700">
              ایمیل
            </label>
            <Input
              type="email"
              placeholder="email@gmail.com"
              dir="ltr"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <div className="min-h-5 mt-1">
              <p
                className={clsx(
                  'text-xs text-danger-400 transition-opacity duration-200',
                  errors.email
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                )}
                aria-live="polite"
              >
                {errors.email?.message}
              </p>
            </div>
          </div>

          {/* 📱 Phone */}
          <div>
            <label className="text-sm mb-2 inline-block font-medium text-neutral-700">
              شماره تماس
            </label>
            <Input
              type="tel"
              placeholder="09123456789"
              dir="ltr"
              aria-invalid={!!errors.phone}
              {...register('phone')}
            />
            <div className="min-h-5 mt-1">
              <p
                className={clsx(
                  'text-xs text-danger-400 transition-opacity duration-200',
                  errors.phone
                    ? 'opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
                )}
                aria-live="polite"
              >
                {errors.phone?.message}
              </p>
            </div>
          </div>
        </div>

        {/* 💬 Message */}
        <div>
          <label className="text-sm mb-2 inline-block font-medium text-neutral-700">
            متن
          </label>
          <Textarea
            placeholder="متن نمونه"
            rows={5}
            aria-invalid={!!errors.message}
            {...register('message')}
          />
          <div className="min-h-5 mt-1">
            <p
              className={clsx(
                'text-xs text-danger-400 transition-opacity duration-200',
                errors.message
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible pointer-events-none'
              )}
              aria-live="polite"
            >
              {errors.message?.message}
            </p>
          </div>
        </div>

        {/* 🚀 Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 text-lg cursor-pointer font-bold bg-linear-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              در حال ارسال...
            </span>
          ) : (
            'ارسال'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
