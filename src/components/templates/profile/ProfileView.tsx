import InfoRow from "@/components/templates/profile/InfoRow";
import { ProfileField, UserProfile } from "@/types/profileTypes";
import { Mail, Phone } from "lucide-react";

// 📝 Form fields configuration
const PROFILE_FIELDS: ProfileField[] = [
  { name: 'firstName', label: 'نام', placeholder: 'مثال: فاطمه', direction: 'rtl' },
  { name: 'lastName', label: 'نام خانوادگی', placeholder: 'مثال: طیبی', direction: 'rtl' },
  { name: 'nationalCode', label: 'کد ملی', placeholder: 'مثال: ۳۷۹۰۰۹۷۳۳۲', direction: 'rtl', maxLength: 10 },
  { name: 'birthDate', label: 'تاریخ تولد', placeholder: 'مثال: ۱۳۶۷/۱۲/۲۲', direction: 'rtl' },
  { name: 'gender', label: 'جنسیت', placeholder: 'آقا یا خانم', direction: 'rtl' },
  { name: 'city', label: 'شهر', placeholder: 'مثال: تهران', direction: 'rtl' },
  { name: 'mobile', label: 'موبایل', placeholder: 'مثال: ۰۹۱۲۳۴۵۶۷۸۹', direction: 'ltr', icon: <Phone size={16} />, maxLength: 11 },
  { name: 'email', label: 'ایمیل', placeholder: 'example@email.com', direction: 'ltr', type: 'email', icon: <Mail size={16} /> }
];
// 👁️ Profile view mode
const ProfileView = ({ profile }: { profile: UserProfile }) => (


  <div className="grid sm:grid-cols-2 gap-4">
    {PROFILE_FIELDS.map((field) => (
      <InfoRow
        key={field.name}
        label={`${field.label}:`}
        value={profile[field.name]}
        icon={field.icon}
      />
    ))}
  </div>
);

export default ProfileView;
