"use client";

import { Award, CalendarClock, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { toggleArrayItem } from "@/lib/utils/array-utils";
import { formatFaNumber } from "@/lib/utils/persian-format";
import { FilterConfig } from "@/types/filters";

interface Props {
  filter:   FilterConfig;
  value:    string[];
  onChange: (vals: string[]) => void;
}

// 🎨 One relevant leading icon per group — keyed by filter id (constants untouched)
const GROUP_ICONS: Record<string, LucideIcon> = {
  specialties:  Stethoscope,
  insurances:   ShieldCheck,
  experience:   Award,
  availability: CalendarClock,
};

// Title sits INSIDE AccordionTrigger (Radix wraps it in <h3>) for valid, hydration-stable
// heading nesting. A count pill keeps the collapsed section informative.
export default function MultiSelectFilter({ filter, value, onChange }: Props) {
  const count = value.length;            // 🔢 selected in this group
  const Icon = GROUP_ICONS[filter.id];   // 🩺 group glyph

  return (
    <AccordionItem value={filter.id} className="overflow-hidden rounded-xl border border-neutral-200 last:border-b transition-colors data-[state=open]:border-primary-300">
      <AccordionTrigger className="h-11 cursor-pointer items-center px-4 hover:no-underline [&>svg]:size-4 [&>svg]:text-neutral-400">
        <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-900">
          {Icon && <Icon size={17} className={cn("shrink-0", count > 0 ? "text-primary-600" : "text-neutral-400")} />}
          {filter.title}
          {count > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-50 px-1.5 text-[11px] font-semibold text-primary-700">
              {formatFaNumber(count)}
            </span>
          )}
        </span>
      </AccordionTrigger>

      <AccordionContent className="border-t border-neutral-200 p-1.5">
        <div className="max-h-44 space-y-0.5 overflow-y-auto">
          {filter.options.map(opt => {
            const checked = value.includes(opt.id);
            return (
              <Label
                key={opt.id}
                htmlFor={`${filter.id}-${opt.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                  checked ? "bg-primary-50" : "hover:bg-neutral-50",
                )}
              >
                <Checkbox
                  id={`${filter.id}-${opt.id}`}
                  checked={checked}
                  onCheckedChange={() => onChange(toggleArrayItem(value, opt.id))}
                  className="data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600"
                />
                <span className={cn("text-sm", checked ? "font-medium text-primary-800" : "text-neutral-700")}>
                  {opt.label}
                </span>
              </Label>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
