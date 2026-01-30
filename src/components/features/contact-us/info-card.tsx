import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

// 📇 Info card with icon — clean, accessible, and layout-stable
interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  bgColor: string;
  iconBg: string;
  dir?: 'ltr' | 'rtl';
}

const InfoCard: FC<InfoCardProps> = ({ icon: Icon, label, value, bgColor, iconBg, dir }) => {
  return (
    <div className={clsx('flex items-center gap-4 p-4 rounded-xl transition-colors', bgColor)}>
      <div className={clsx('p-3 rounded-full', iconBg)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p
          className="font-bold text-gray-800 text-lg"
          {...(dir ? { dir } : {})}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
