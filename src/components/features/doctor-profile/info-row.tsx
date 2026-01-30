import { HugeiconsIcon } from "@hugeicons/react";


// 📍 Info Row Component
const InfoRow = ({ icon, label, value}: {icon: any; label: string; value: string;}) => (
  <div className="flex items-center gap-x-1 xs:gap-x-2">
    <HugeiconsIcon icon={icon} size={20} color="#262626" />
    <span className="font-medium text-xs xs:text-sm text-neutral-950 whitespace-nowrap">
      {label}
    </span>
    <span className="text-neutral-850 text-xs xs:text-sm font-medium line-clamp-1">
      {value}
    </span>
  </div>
);

export default InfoRow;
