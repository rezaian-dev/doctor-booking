import FormInput from '@/components/FormInput';
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
  { name: 'city', label: 'شهر', placeholder: 'مثال: تهران', direction: 'rtl' },
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

// ✏️ Profile edit mode using shared FormInput with map
const ProfileEdit = ({ register, errors }: any) => (
  <div className="grid sm:grid-cols-2 gap-4">
    {PROFILE_FIELDS.map(field => (
      <FormInput
        key={field.name}
        variant="profile"
        label={field.label}
        placeholder={field.placeholder}
        direction={field.direction}
        type={field.type}
        icon={field.icon}
        maxLength={field.maxLength}
        error={errors[field.name]}
        {...register(field.name)}
      />
    ))}
  </div>
);

export default ProfileEdit;
