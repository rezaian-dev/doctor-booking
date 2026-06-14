import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="rounded-[10px] gap-x-3 flex items-start py-5 px-3 xl:p-10 border border-neutral-100 drop-shadow-[0px_-8px_32px_0px_rgba(0,0,0,0.05)]">
      <div>
        <Icon size={24} className="text-primary-500" />
      </div>
      <div className="flex flex-col gap-y-1">
        {/* ♿ h3 (not h4): sits under the section's h2 — keeps heading order sequential */}
        <h3 className="font-medium text-sm sm:text-base xl:text-lg">{title}</h3>
        <span className="text-[13px] font-normal text-neutral-800">
          {description}
        </span>
      </div>
    </div>
  );
};

export default FeatureCard;
