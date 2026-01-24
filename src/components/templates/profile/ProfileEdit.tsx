import { Input } from '@/components/ui/input';
import { ProfileField } from '@/types/profileTypes';
import { Mail, Phone } from 'lucide-react';

// 📝 Form fields configuration
const PROFILE_FIELDS: ProfileField[] = [
  {
    name: 'firstName',
    label: 'نام',
    placeholder: 'مثال: فاطمه',
    direction: 'rtl',
  },
  {
    name: 'lastName',
    label: 'نام خانوادگی',
    placeholder: 'مثال: طیبی',
    direction: 'rtl',
  },
  {
    name: 'nationalCode',
    label: 'کد ملی',
    placeholder: 'مثال: ۳۷۹۰۰۹۷۳۳۲',
    direction: 'rtl',
    maxLength: 10,
  },
  {
    name: 'birthDate',
    label: 'تاریخ تولد',
    placeholder: 'مثال: ۱۳۶۷/۱۲/۲۲',
    direction: 'rtl',
  },
  {
    name: 'gender',
    label: 'جنسیت',
    placeholder: 'آقا یا خانم',
    direction: 'rtl',
  },
  {
    name: 'city',
    label: 'شهر',
    placeholder: 'مثال: تهران',
    direction: 'rtl'
  },
  {
    name: 'mobile',
    label: 'موبایل',
    placeholder: 'مثال: ۰۹۱۲۳۴۵۶۷۸۹',
    direction: 'ltr',
    icon: <Phone size={16} />,
    maxLength: 11,
  },
  {
    name: 'email',
    label: 'ایمیل',
    placeholder: 'example@email.com',
    direction: 'ltr',
    type: 'email',
    icon: <Mail size={16} />,
  },
];

// ✏️ Profile edit mode using shadcn/ui Input with map
const ProfileEdit = ({ register, errors }: any) => (
  <div className="grid sm:grid-cols-2 gap-x-4">
    {PROFILE_FIELDS.map(field => (
      <div key={field.name} className="space-y-2">
        {/* Label */}
        <label className="text-sm mb-2 inline-block font-medium text-gray-700">
          {field.label}
        </label>

        {/* Input with optional icon wrapper */}
        <div className="relative">
          {field.icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {field.icon}
            </div>
          )}
          <Input
            type={field.type || 'text'}
            placeholder={field.placeholder}
            dir={field.direction}
            maxLength={field.maxLength}
            aria-invalid={!!errors[field.name]}
            className={field.icon ? 'pl-10' : ''}
            {...register(field.name)}
          />
        </div>

        {/* 🎯 Fixed-height error container with opacity transition */}
        <div className="h-5 mt-1">
          <p
            className={`text-xs text-[#FF6565] transition-opacity duration-200 ${
              errors[field.name] ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {errors[field.name]?.message || '\u00A0'}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default ProfileEdit;
