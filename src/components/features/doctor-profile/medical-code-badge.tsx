import clsx from "clsx";
import { GoCheckCircle } from "react-icons/go";

// 🏅 Medical Code Badge
const MedicalCodeBadge = ({ code, className }: { code: string; className?: string }) => (
  <div className={clsx('flex items-center gap-x-2 sm:gap-x-4', className)}>
    <GoCheckCircle className="shrink-0 size-4 xs:size-5" size={20} color="#4F4F4F" />
    <span className="text-xs xs:text-sm text-medium-gray">
      کد نظام پزشکی: {code}
    </span>
  </div>
);

export default MedicalCodeBadge;
