import { Button } from '@/components/ui/button';
import { ProfileMode } from '@/types/doctor-profile-types';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';

// 🔘 Action Buttons Component
const ActionButtons = ({ mode }: { mode: ProfileMode }) => {
  const config = {
    'find-doctor': {
      primary: 'رزرو نوبت',
      secondary: 'مشاهده پروفایل',
    },
    profile: {
      primary: 'مشاهده پروفایل',
      secondary: 'لغو نوبت',
    },
  };

  const buttons = config[mode as keyof typeof config];
  if (!buttons) return null;

  return (
    <div className="flex items-center px-3 justify-center mt-4 mb-4 md:mb-6 flex-col xs:flex-row gap-x-3 lg:gap-x-11.5 gap-y-4 mx-auto">
      {/* Primary Button */}
      <Button
        asChild
        className="w-full max-w-82.5 h-10 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium"
      >
        <Link href="#" className="flex items-center justify-center gap-x-1.5">
          {buttons.primary}
          <IoIosArrowBack size={20} className="text-white" />
        </Link>
      </Button>

      {/* Secondary Button */}
      <Button
        asChild
        variant="outline"
        className="w-full max-w-82.5 h-10 rounded-xl border-neutral-100 bg-white text-neutral-500 text-sm font-medium hover:bg-neutral-50"
      >
        <Link href="#">{buttons.secondary}</Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
