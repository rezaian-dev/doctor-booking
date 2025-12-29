import ContinueButton from "@/components/ContinueButton";
import { ProfileMode } from "@/types/doctorProfile";
import Link from "next/link";

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
    <div className="flex items-center px-3 justify-center mt-4 mb-4 md:mb-6 flex-col xs:flex-row gap-x-3 lg:gap-x-[46px] gap-y-4 mx-auto">
      <ContinueButton text={buttons.primary} mode="doctor-find" />
      <Link
        href="#"
        className="text-sm font-medium text-neutral-500 bg-white h-10 rounded-xl border border-neutral-100 flex items-center w-full justify-center max-w-[330px]"
      >
        {buttons.secondary}
      </Link>
    </div>
  );
};

export default ActionButtons;
