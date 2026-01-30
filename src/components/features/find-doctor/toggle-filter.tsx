'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toggleArrayItem } from '@/lib/utils/filter-utils';
import { Controller } from 'react-hook-form';

/**
 * 🧾 Gender filter as a dual-checkbox group (multi-select compatible).
 * - Despite the name "ToggleFilter", it allows selecting both "male" and "female" ✅
 * - Uses `react-hook-form` + `toggleArrayItem` for seamless array state sync 🔄
 * - Fully controlled and accessible via label-click 🖱️
 */
const ToggleFilter = () => (
  <Controller
    name="gender"
    render={({ field: { value = [], onChange } }) => (
      <div className="mb-4 mt-1.5">
        {/* 🏷️ Section title (in Persian per UI requirements) */}
        <h4 className="font-medium text-xs xs:text-base mb-3">جنسیت</h4>

        {/* ⚙️ Dual-option checkbox group */}
        <div className="flex items-center gap-4">
          {[
            { id: 'male', label: 'مرد' },
            { id: 'female', label: 'زن' },
          ].map(opt => (
            <Label
              key={opt.id}
              htmlFor={`gender-${opt.id}`}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                id={`gender-${opt.id}`}
                checked={value.includes(opt.id)}
                // 🔄 Toggle selection in form array state
                onCheckedChange={() => onChange(toggleArrayItem(value, opt.id))}
                className="data-[state=checked]:bg-primary-700 data-[state=checked]:border-primary-700"
              />
              <span className="text-xs xs:text-sm">{opt.label}</span>
            </Label>
          ))}
        </div>
      </div>
    )}
  />
);

export default ToggleFilter;
