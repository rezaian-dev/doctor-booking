import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

// 🔗 Accessible social media button with hover effects & security best practices
interface SocialButtonProps {
  icon: LucideIcon;
  bgColor: string;
  href: string;
  label: string;
}

const SocialButton: FC<SocialButtonProps> = ({ icon: Icon, bgColor, href, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'p-3 rounded-full transition-all',
        bgColor,
        'hover:scale-110 hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300'
      )}
      aria-label={`دنبال کردن در ${label}`}
    >
      <Icon className="size-4 md:size-5 text-white" />
    </a>
  );
};

export default SocialButton;
