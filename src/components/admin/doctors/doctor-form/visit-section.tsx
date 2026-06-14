// 🩺 Visit details: fee, visit types, insurances. Insurances reuse the specialty/city
//    combobox style (basic-info-section) — only multiple=true differs.
"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { HeartPulse, ShieldCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { formatFaNumber } from "@/lib/utils/persian-format";
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList,
  ComboboxChips, ComboboxChipsInput, useComboboxAnchor,
} from "@/components/ui/combobox";
import { Section, type DoctorFormControl } from "./section";

// 🩹 Visit-type toggles — single source for the two boolean fields
const VISIT_TYPES = [
  { name: "hasInPersonVisit", id: "in-person", label: "حضوری" },
  { name: "hasOnlineVisit", id: "online", label: "آنلاین" },
] as const;

// 🏷️ Insurance chip via ComboboxPrimitive.Chip + ChipRemove so base-ui's deselect fires.
//    No value prop (Chip has none, TS2322): base-ui resolves it from render order. 🔧
function InsuranceChip({ label }: { label: string }) {
  return (
    <ComboboxPrimitive.Chip
      className="group flex h-7 cursor-default items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-2.5 text-xs font-semibold text-primary-700 shadow-sm transition-all hover:border-primary-300 hover:bg-primary-100"
    >
      <span className="leading-none">{label}</span>

      {/* ✖️ Remove button — styled, not the default ugly icon-button */}
      <ComboboxPrimitive.ChipRemove
        className="flex size-4 items-center justify-center rounded-full text-primary-400 outline-none transition-colors hover:bg-primary-300 hover:text-primary-800 focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        <X size={10} strokeWidth={2.5} className="pointer-events-none" />
      </ComboboxPrimitive.ChipRemove>
    </ComboboxPrimitive.Chip>
  );
}

export function DoctorVisitSection({
  control, insurances,
}: {
  control: DoctorFormControl;
  insurances: readonly string[];
}) {
  const insuranceAnchor = useComboboxAnchor();

  return (
    <Section title="اطلاعات ویزیت" subtitle="نوع ویزیت، بیمه‌ها و هزینه" icon={HeartPulse}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="visitFee" render={({ field }) => (
          <FormItem>
            <FormLabel>هزینه ویزیت (تومان) *</FormLabel>
            <FormControl>
              <Input {...field} value={field.value == null ? "" : String(field.value)} type="number" min={0} placeholder="500000" />
            </FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        {/* 🔀 Visit type — group caption + checkbox row.
            🐛 FIX: the old <FormItem> (CSS grid + default `align-content: stretch`)
            got stretched by the taller sibling column → a huge gap pushed the
            checkboxes to the bottom of the cell. A top-packed flex column with a
            plain <Label> (FormLabel needs a FormField context) is immune to that.
            min-h-9 vertically centers the row on the same line as the fee input. ✅ */}
        <div className="flex flex-col gap-2">
          <Label>نوع ویزیت</Label>
          <div className="flex min-h-9 flex-wrap items-center gap-x-6 gap-y-2">
            {VISIT_TYPES.map(({ name, id, label }) => (
              <FormField key={id} control={control} name={name} render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox id={id} checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                  <label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">{label}</label>
                </div>
              )} />
            ))}
          </div>
        </div>

        {/* 🛡️ Insurances — multi-select combobox, styled identically to specialty/city */}
        <FormField control={control} name="acceptedInsurances" render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <FormLabel>بیمه‌های پذیرفته</FormLabel>
              {field.value.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => field.onChange([])}
                  className="h-7 gap-1 px-2 text-xs text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                >
                  <Trash2 size={12} /> پاک کردن همه
                </Button>
              )}
            </div>

            <Combobox
              items={insurances as string[]}
              value={field.value}
              onValueChange={(v: string[]) => field.onChange(v)}
              multiple
            >
              {/* 🎨 Chip container — same border/focus ring tokens as FormCombobox input */}
              <ComboboxChips
                ref={insuranceAnchor}
                className="min-h-11 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 transition-[color,border-color] duration-150 hover:border-primary-300 focus-within:border-primary-500 focus-within:ring-0"
              >
                {/* 🏷️ Leading icon */}
                <InputGroupAddon
                  align="inline-start"
                  className={`pr-1 pl-0 transition-colors ${field.value.length > 0 ? "text-primary-600" : "text-neutral-400"}`}
                >
                  <ShieldCheck className="size-4.25" />
                </InputGroupAddon>

                {/* 💊 Selected chips — with fully working remove */}
                {field.value.map((ins) => (
                  <InsuranceChip key={ins} label={ins} />
                ))}

                <ComboboxChipsInput
                  placeholder={field.value.length === 0 ? "جستجو و انتخاب بیمه‌ها..." : ""}
                  className="text-sm text-neutral-700 placeholder:text-neutral-400"
                />
              </ComboboxChips>

              {/* 📋 Popup — identical to FormCombobox: rounded-2xl, shadow-xl, p-1.5 */}
              <ComboboxContent
                anchor={insuranceAnchor}
                className="max-h-72 rounded-2xl border border-neutral-100 p-1.5 shadow-xl ring-black/5"
              >
                <ComboboxEmpty className="py-6 text-neutral-400">بیمه‌ای یافت نشد.</ComboboxEmpty>
                <ComboboxList className="max-h-64">
                  {(item: string) => (
                    <ComboboxItem
                      key={item}
                      value={item}
                      className="rounded-xl py-2.5 pr-9 pl-3 text-sm font-medium text-neutral-700 transition-colors data-highlighted:bg-primary-50 data-highlighted:text-primary-700 data-selected:bg-primary-50 data-selected:font-semibold data-selected:text-primary-700 [&_svg]:text-primary-600"
                    >
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {field.value.length > 0 && (
              <p className="mt-1.5 text-xs text-primary-600">
                {formatFaNumber(field.value.length)} بیمه انتخاب شده
              </p>
            )}
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />
      </div>
    </Section>
  );
}
