import { FC } from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import InfoCard from './info-card';
import SocialLinks from './social-links';

// 📞 Contact info cards — semantic, accessible, and responsive
const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'پشتیبانی:',
    value: '021-44219699',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    iconBg: 'bg-blue-500',
    dir: 'ltr' as const
  },
  {
    icon: Clock,
    label: 'ساعات پاسخگویی:',
    value: '۷ روز هفته | ۷ صبح تا نیمه‌شب',
    bgColor: 'bg-green-50 hover:bg-green-100',
    iconBg: 'bg-green-500'
  },
  {
    icon: MapPin,
    label: 'کد پستی:',
    value: '1566918525',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    iconBg: 'bg-purple-500',
    dir: 'ltr' as const
  }
];

// 📍 Main contact section with address, info cards, and social links
const ContactInfo: FC = () => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        تماس با دکتر رزور
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {CONTACT_INFO.map((info) => (
          <InfoCard key={info.label} {...info} />
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <p className="text-gray-700 leading-relaxed text-center">
          <span className="font-semibold">آدرس:</span> تهران، خیابان شریعتی، خیابان ملک، خیابان ورنوابی، پلاک ۱۳ ساختمان امیر
        </p>
      </div>

      <SocialLinks />
    </div>
  );
};

export default ContactInfo;
