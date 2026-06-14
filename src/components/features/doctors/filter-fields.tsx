'use client';

import { Search } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { FILTER_KEY_MAP, type ArrayFilterKey, type FilterState } from '@/hooks/use-filter-params';
import type { FilterConfig } from '@/types/filters';
import CityCombobox from './city-combobox';
import MultiSelectFilter from './multi-select-filter';
import ToggleFilter from './toggle-filter';

interface Props {
  showSearch:   boolean;            // 🔍 search visible on /doctors only
  groups:       FilterConfig[];     // 🧩 static groups (no city)
  cityGroup?:   FilterConfig | undefined;
  draft:        FilterState;
  setPatch:     (p: Partial<FilterState>) => void;
  setArrayField:(key: ArrayFilterKey, vals: string[]) => void;
  openId:       string;
  setOpenId:    (id: string) => void;
}

// 📏 One label style → consistent typography across every section
const labelClass = 'text-sm font-medium text-neutral-900';

// 🧱 Filter form body — identical on desktop & mobile, only the shell differs
export default function FilterFields({
  showSearch, groups, cityGroup, draft, setPatch, setArrayField, openId, setOpenId,
}: Props) {
  return (
    <div className="space-y-5">
      {/* 🔍 Doctor name search */}
      {showSearch && (
        <InputGroup className="h-11 rounded-xl border-neutral-200 transition-colors focus-within:border-primary-500">
          <InputGroupInput
            value={draft.search}
            onChange={e => setPatch({ search: e.target.value })}
            placeholder="جستجوی نام پزشک"
            className="text-sm text-neutral-700 placeholder:text-neutral-400"
          />
          <InputGroupAddon align="inline-end" className="pl-3">
            <Search size={17} className="text-neutral-400" />
          </InputGroupAddon>
        </InputGroup>
      )}

      {/* 🏙️ City — searchable multi-select combobox */}
      {cityGroup && (
        <div className="space-y-2">
          <Label htmlFor="city-filter" className={labelClass}>{cityGroup.title}</Label>
          <CityCombobox
            id="city-filter"
            options={cityGroup.options}
            value={draft.city}
            onChange={vals => setArrayField('city', vals)}
          />
        </div>
      )}

      {/* 🎛️ Single-open accordion — collapsed sections show a count pill */}
      <Accordion type="single" collapsible value={openId} onValueChange={setOpenId} className="space-y-2.5">
        {groups.map(filter => {
          const key = FILTER_KEY_MAP[filter.id];
          if (!key) return null;
          return (
            <MultiSelectFilter
              key={filter.id}
              filter={filter}
              value={draft[key]}
              onChange={vals => setArrayField(key, vals)}
            />
          );
        })}
      </Accordion>

      {/* 🚻 Gender */}
      <ToggleFilter value={draft.gender} onChange={val => setPatch({ gender: val })} />
    </div>
  );
}
