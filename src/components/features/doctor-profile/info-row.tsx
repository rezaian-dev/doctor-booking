import { type LucideIcon } from 'lucide-react';

interface InfoRowProps {
  icon:   LucideIcon;
  label:  string;
  value?: string;
}

export default function InfoRow({ icon: Icon, label, value = "—" }: InfoRowProps) {
  return (
    <div className="flex items-center gap-x-1 xs:gap-x-2">
      <Icon size={20} color="#262626" />
      <span className="font-medium text-xs xs:text-sm text-neutral-950 whitespace-nowrap">{label}</span>
      <span className="text-neutral-850 text-xs xs:text-sm font-medium line-clamp-1">{value}</span>
    </div>
  );
}
