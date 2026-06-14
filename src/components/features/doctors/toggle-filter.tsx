'use client';

import { Mars, Venus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  value:    string;
  onChange: (val: string) => void;
}

// ♂️♀️ Gender-specific glyphs for each option
const OPTIONS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'male',   label: 'مرد', Icon: Mars  },
  { id: 'female', label: 'زن',  Icon: Venus },
];

// 🚻 Single-choice gender as a clean segmented control (click active again to clear)
export default function ToggleFilter({ value, onChange }: Props) {
  return (
    <div>
      <h4 className="mb-2.5 text-sm font-medium text-neutral-900">جنسیت پزشک</h4>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(({ id, label, Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? '' : id)}
              className={cn(
                'flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40',
                active
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300 hover:bg-neutral-50',
              )}
            >
              <Icon size={16} className={active ? 'text-primary-600' : 'text-neutral-400'} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
