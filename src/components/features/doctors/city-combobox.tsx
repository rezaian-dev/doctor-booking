'use client';

import { useMemo } from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { MapPin, X } from 'lucide-react';
import { InputGroupAddon } from '@/components/ui/input-group';
import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { formatFaNumber } from '@/lib/utils/persian-format';
import type { FilterOption } from '@/types/filters';

interface Props {
  options: FilterOption[];          // 🏙️ { id: slug, label: Persian name }
  value: string[];                  // ✅ selected city slugs
  onChange: (vals: string[]) => void;
  id?: string;
}

// 🔤 Normalize Persian/Arabic variants so search matches regardless of keyboard
const normalize = (s: string) =>
  s.replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ').trim().toLowerCase();

// 🏷️ City chip — value resolved by render order inside <ComboboxChips> (Chip has no `value` prop)
function CityChip({ label }: { label: string }) {
  return (
    <ComboboxPrimitive.Chip className="group flex h-7 cursor-default items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-2.5 text-xs font-semibold text-primary-700 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-100">
      <span className="leading-none">{label}</span>
      <ComboboxPrimitive.ChipRemove className="flex size-4 items-center justify-center rounded-full text-primary-400 outline-none transition-colors hover:bg-primary-300 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400">
        <X size={10} strokeWidth={2.5} className="pointer-events-none" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  );
}

// 🏙️ Searchable, multi-select city picker — slugs in state, Persian labels on screen
export default function CityCombobox({ options, value, onChange, id }: Props) {
  const anchor = useComboboxAnchor();

  // 🗺️ slug → label lookup for chips, list rows, and label-based filtering
  const slugs = useMemo(() => options.map(o => o.id), [options]);
  const labelOf = useMemo(() => {
    const map = new Map(options.map(o => [o.id, o.label]));
    return (slug: string) => map.get(slug) ?? slug;
  }, [options]);

  return (
    <Combobox
      items={slugs}
      value={value}
      onValueChange={(v: string[]) => onChange(v)}
      multiple
      // 🔎 Filter by the Persian label, not the english slug stored as value
      filter={(slug: string, query: string) =>
        normalize(labelOf(slug)).includes(normalize(query))
      }
    >
      <ComboboxChips
        ref={anchor}
        className="min-h-11 gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 transition-colors duration-150 hover:border-primary-300 focus-within:border-primary-500 focus-within:ring-0"
      >
        <InputGroupAddon
          align="inline-start"
          className={`pr-1 pl-0 transition-colors ${value.length > 0 ? 'text-primary-600' : 'text-neutral-400'}`}
        >
          <MapPin className="size-4.25" />
        </InputGroupAddon>

        {/* 💊 Selected chips — order matches `value`, so remove maps correctly */}
        {value.map(slug => (
          <CityChip key={slug} label={labelOf(slug)} />
        ))}

        <ComboboxChipsInput
          id={id}
          placeholder={value.length === 0 ? 'جستجو و انتخاب شهر…' : ''}
          className="text-sm text-neutral-700 placeholder:text-neutral-400"
        />
      </ComboboxChips>

      <ComboboxContent
        anchor={anchor}
        className="max-h-72 rounded-2xl border border-neutral-100 p-1.5 shadow-xl ring-black/5"
      >
        <ComboboxEmpty className="py-6 text-neutral-400">شهری یافت نشد.</ComboboxEmpty>
        <ComboboxList className="max-h-64">
          {(slug: string) => (
            <ComboboxItem
              key={slug}
              value={slug}
              className="rounded-xl py-2.5 pr-9 pl-3 text-sm font-medium text-neutral-700 transition-colors data-highlighted:bg-primary-50 data-highlighted:text-primary-700 data-selected:bg-primary-50 data-selected:font-semibold data-selected:text-primary-700 [&_svg]:text-primary-600"
            >
              {labelOf(slug)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>

      {value.length > 0 && (
        <p className="mt-1.5 text-xs text-primary-600">
          {formatFaNumber(value.length)} شهر انتخاب شده
        </p>
      )}
    </Combobox>
  );
}
