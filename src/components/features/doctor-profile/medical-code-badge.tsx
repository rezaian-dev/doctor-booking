import { cn } from "@/lib/utils/cn";
import { CheckCircle2 } from "lucide-react";

interface MedicalCodeBadgeProps {
  code?:      string;
  className?: string;
}

export default function MedicalCodeBadge({ code = "—", className }: MedicalCodeBadgeProps) {
  return (
    <div className={cn("flex items-center gap-x-2 sm:gap-x-4", className)}>
      <CheckCircle2 className="shrink-0 size-4 xs:size-5 text-neutral-500" />
      <span className="text-xs xs:text-sm text-medium-gray">کد نظام پزشکی: {code}</span>
    </div>
  );
}
