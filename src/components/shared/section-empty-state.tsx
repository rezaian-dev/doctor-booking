// 🪄 Lightweight empty-state for homepage carousels (doctors & articles).
//    No heavy deps — just Tailwind + a single lucide icon. Fully RTL.

import type { LucideIcon } from 'lucide-react';
import { Stethoscope, BookOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type Variant = 'doctors' | 'articles' | 'generic';

interface SectionEmptyStateProps {
  variant?: Variant;
  /** fallback if you don't want a preset variant */
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
}

const PRESETS: Record<Variant, { icon: LucideIcon; title: string; description: string }> = {
  doctors: {
    icon: Stethoscope,
    title: 'پزشکی ثبت نشده',
    description: 'هنوز هیچ پزشکی در این بخش اضافه نشده است.',
  },
  articles: {
    icon: BookOpen,
    title: 'مقاله‌ای منتشر نشده',
    description: 'اولین مقاله به‌زودی اینجا نمایش داده می‌شود.',
  },
  generic: {
    icon: Search,
    title: 'موردی یافت نشد',
    description: 'در حال حاضر محتوایی برای نمایش وجود ندارد.',
  },
};

export function SectionEmptyState({
  variant = 'generic',
  icon,
  title,
  description,
  className,
}: SectionEmptyStateProps) {
  const preset = PRESETS[variant];
  const Icon = icon ?? preset.icon;
  const resolvedTitle = title ?? preset.title;
  const resolvedDesc = description ?? preset.description;

  return (
    <div
      className={cn(
        // 🎨 Dashed border + subtle tint — clearly "placeholder" without being harsh
        'flex flex-col items-center justify-center gap-4 rounded-2xl',
        'border border-dashed border-neutral-200 bg-neutral-50/60',
        'px-6 py-12 text-center',
        className,
      )}
    >
      {/* 🔵 Icon bubble */}
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
        <Icon size={28} strokeWidth={1.5} aria-hidden />
      </span>

      {/* 📝 Copy */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-700">{resolvedTitle}</p>
        <p className="text-xs leading-relaxed text-neutral-500">{resolvedDesc}</p>
      </div>
    </div>
  );
}
