'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { toggleArrayItem } from '@/components/utils/filters';
import { FilterConfig } from '@/types/filters';
import { Controller } from 'react-hook-form';

// 📦 Props for controlled accordion behavior
interface MultiSelectFilterProps {
  filter: FilterConfig;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * 🧩 Reusable multi-select filter wrapped in a collapsible accordion.
 * - Fully controlled via `react-hook-form` 🎮
 * - Syncs checkbox selections with form state ✅
 * - Supports smooth toggle logic using `toggleArrayItem` 🔄
 */
const MultiSelectFilter = ({ filter, isOpen, onToggle }: MultiSelectFilterProps) => {
  return (
    <Controller
      name={filter.id}
      render={({ field: { value = [], onChange } }) => (
        <div className="border-b border-neutral-100 pb-4">
          {/* 🏷️ Section title */}
          <h4 className="font-medium text-sm xs:text-base text-neutral-950 my-4">{filter.title}</h4>

          {/* 🗂️ Controlled Accordion: open state driven by parent */}
          <Accordion
            type="single"
            collapsible
            value={isOpen ? filter.id : ""} // 🔑 Only open if parent says so
            onValueChange={onToggle}        // 🔄 Notify parent on toggle
          >
            <AccordionItem
              value={filter.id}
              className="rounded-xl border! border-neutral-100 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline px-3 xs:px-4 h-12 flex items-center gap-x-0 xs:gap-x-2 text-xs xs:text-sm font-normal cursor-pointer [&>svg]:size-4 sm:[&>svg]:size-5 lg:[&>svg]:size-6 text-neutral-600">
                {filter.label}
              </AccordionTrigger>
              <AccordionContent className="px-3 xs:px-4 pt-2 pb-4 space-y-3 max-h-40 overflow-y-auto bg-neutral-50">
                {/* ☑️ Render each option as an interactive checkbox label */}
                {filter.options.map(opt => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-neutral-100 transition"
                  >
                    <Checkbox
                      checked={value.includes(opt.id)}
                      // 🔄 Toggle selection in array on click
                      onCheckedChange={() => onChange(toggleArrayItem(value, opt.id))}
                      className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
                    />
                    <span className="text-xs xs:text-sm">{opt.label}</span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    />
  );
};

export default MultiSelectFilter;