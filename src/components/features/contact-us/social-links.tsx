import { Instagram, Linkedin, Send } from 'lucide-react';
import SocialButton from './social-button';

// 🌐 Social media links with accessible labels & gradient styles
const SOCIAL_LINKS = [
  { icon: Instagram, bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500', href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, bgColor: 'bg-blue-600', href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Send, bgColor: 'bg-blue-400', href: 'https://t.me', label: 'Telegram' }
];

const SocialLinks = () => {
  return (
    <div className="flex items-center justify-center gap-3 flex-col xs:flex-row md:gap-6" aria-label="شبکه‌های اجتماعی">
      <span className="text-gray-600 font-medium">شبکه‌های اجتماعی:</span>
      {SOCIAL_LINKS.map((social) => (
        <SocialButton
          key={social.label}
          icon={social.icon}
          bgColor={social.bgColor}
          href={social.href}
          label={social.label}
        />
      ))}
    </div>
  );
};

export default SocialLinks;
