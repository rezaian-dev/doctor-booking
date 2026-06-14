'use client';

import { createElement, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronLeft, SearchX, Stethoscope, HeartPulse, Brain, Eye, Ear, Bone,
  Baby, Smile, Scissors, ScanLine, Dna, Droplet, ShieldPlus, Sparkles, Syringe,
  Activity, type LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';
import { formatFaNumber } from '@/lib/utils/persian-format';
import CountUp from '@/components/features/home/count-up';

// 🩺 One specialty entry, prepared on the server (id + label + description + live doctor count)
export interface Specialty {
  id: string;
  label: string;
  desc: string;
  count: number;
}

// 🎨 6 soft accent tints — cycled by index for a calm, varied grid
const ACCENTS = [
  'bg-sky-50 text-sky-600 ring-sky-100',
  'bg-emerald-50 text-emerald-600 ring-emerald-100',
  'bg-violet-50 text-violet-600 ring-violet-100',
  'bg-amber-50 text-amber-600 ring-amber-100',
  'bg-rose-50 text-rose-600 ring-rose-100',
  'bg-teal-50 text-teal-600 ring-teal-100',
] as const;

// 🧭 Pick a fitting icon from the specialty id — first match wins, else Stethoscope
const ICON_RULES: [RegExp, LucideIcon][] = [
  [/cardio|cardiac/,                         HeartPulse],
  [/neuro|psych/,                            Brain],
  [/ophthalmolog/,                           Eye],
  [/^ent$/,                                  Ear],
  [/ortho|rheumatolog|sports|physical|physio|occupational-therapy/, Bone],
  [/pediatr|neonat|infertility|gynecolog/,   Baby],
  [/dent|orthodont|perio|endodont|prosthetic|oral/, Smile],
  [/surger/,                                 Scissors],
  [/radiolog|sonograph|mri|ct-scan|nuclear/, ScanLine],
  [/genetic|patholog/,                       Dna],
  [/hematolog|blood|transfusion/,            Droplet],
  [/oncolog|infectious|allergy|immuno/,      ShieldPlus],
  [/dermatolog|cosmetic/,                    Sparkles],
  [/diabetes|endocrin|thyroid|nephro|hepato|gastro|pulmono|urolog/, Activity],
  [/acupuncture|homeopathy|traditional|emergency|forensic|geriatric|speech/, Syringe],
];
const iconFor = (id: string): LucideIcon =>
  ICON_RULES.find(([re]) => re.test(id))?.[1] ?? Stethoscope;

// 🃏 Single clickable card → /doctors filtered by this specialty
function SpecialtyCard({ item, index }: { item: Specialty; index: number }) {
  const icon = iconFor(item.id);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <Link
      href={`/doctors?specialty=${item.id}`}
      className="group relative flex flex-col gap-y-3 rounded-2xl border border-neutral-100 bg-white p-4
                 transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-md
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
    >
      {/* 🩺 Availability badge */}
      <span
        className={cn(
          'absolute top-3 left-3 rounded-full px-2 py-0.5 text-[11px] font-medium leading-5',
          item.count > 0
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-neutral-100 text-neutral-400',
        )}
      >
        {item.count > 0 ? (
          <>
            <CountUp value={item.count} /> پزشک
          </>
        ) : (
          'به‌زودی'
        )}
      </span>

      {/* 🎯 Icon chip */}
      <span className={cn('grid size-11 place-items-center rounded-xl ring-1', accent)}>
        {createElement(icon, { size: 22, 'aria-hidden': 'true' })}
      </span>

      <h3 className="font-medium text-sm md:text-base text-neutral-900">{item.label}</h3>

      <p className="line-clamp-2 text-xs leading-6 text-neutral-500">{item.desc}</p>

      {/* 🔗 Reveal-on-hover CTA */}
      <span className="mt-auto inline-flex items-center gap-x-1 pt-1 text-xs font-medium text-primary-600
                       opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        مشاهده پزشکان
        <ChevronLeft size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}

/**
 * 🏥 Specialties explorer — instant client-side search over the full list.
 */
export default function SpecialtiesExplorer({ items }: { items: Specialty[] }) {
  const [query, setQuery] = useState('');

  // 🔎 Normalize Arabic/Persian variants so search "just works"
  const norm = (s: string) => s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').trim();
  const results = useMemo(() => {
    const q = norm(query);
    if (!q) return items;
    return items.filter((i) => norm(i.label).includes(q) || norm(i.desc).includes(q));
  }, [query, items]);

  return (
    <div className="container px-4 md:px-8 pb-12">
      {/* 🔍 Search box */}
      <div className="relative mt-5 max-w-md">
        <Search
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجوی تخصص..."
          className="h-11 pr-10"
          aria-label="جستجوی تخصص"
        />
      </div>

      {/* #️⃣ Live result count */}
      <p className="mt-3 text-xs text-neutral-400">
        {formatFaNumber(results.length)} تخصص
      </p>

      {/* 🧱 Responsive grid */}
      {results.length > 0 ? (
        <div className="mt-4 grid auto-rows-fr grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((item, i) => (
            <SpecialtyCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        // 🕳️ Empty state
        <div className="flex flex-col items-center gap-y-3 py-20 text-neutral-400">
          <SearchX size={40} aria-hidden="true" />
          <p className="text-sm">تخصصی با این عنوان پیدا نشد.</p>
        </div>
      )}
    </div>
  );
}