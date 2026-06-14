// 👤 Identity & specialty fields. Specialty + city use the SINGLE standard combobox
//    (@base-ui/react via ui/combobox) — same primitive as the insurances multi-select.
"use client";

import { User, Stethoscope, MapPin, type LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InputGroupAddon } from "@/components/ui/input-group";
import {
  Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox";
import { Section, type DoctorFormControl } from "./section";

// 🏷️ Gender choices — single source for the toggle buttons
const GENDERS = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
] as const;

// 🔽 Single-select combobox bound to RHF. base-ui uses null for empty, RHF uses "" →
//    bridge both ways ("" ⇄ null). base-ui auto-anchors the popup to the input. ✨
function FormCombobox({
  items, value, onChange, placeholder, emptyText, icon: Icon,
}: {
  items: readonly string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  emptyText: string;
  icon: LucideIcon; // 🪄 Leading glyph that gives each field its own identity
}) {
  const hasValue = !!value;

  return (
    <Combobox
      items={items as string[]}
      value={value || null}
      onValueChange={(v: string | null) => onChange(v ?? "")}
    >
      <ComboboxInput
        placeholder={placeholder}
        showClear={hasValue}
        className="transition-[color,border-color] duration-150 hover:border-primary-300 has-[[data-slot=input-group-control]:focus-visible]:border-primary-500 **:data-[align=inline-end]:pl-1"
      >
        {/* 🎯 Leading icon (start side in RTL) — muted, turns primary when filled.
            pr-3.5 = inset from the right wall · pl-0 keeps the icon→text gap tight. */}
        <InputGroupAddon
          align="inline-start"
          className={`pr-3.5 pl-0 transition-colors ${hasValue ? "text-primary-600" : "text-neutral-400"}`}
        >
          <Icon className="size-4.25" />
        </InputGroupAddon>
      </ComboboxInput>

      {/* 📋 Elevated popup — rounded, layered shadow, comfy padding */}
      <ComboboxContent className="max-h-72 rounded-2xl border border-neutral-100 p-1.5 shadow-xl ring-black/5">
        <ComboboxEmpty className="py-6 text-neutral-400">{emptyText}</ComboboxEmpty>
        <ComboboxList className="max-h-64">
          {(item: string) => (
            <ComboboxItem
              key={item}
              value={item}
              // 🟦 Touch-friendly rows; highlighted + selected states use primary tints
              className="rounded-xl py-2.5 pr-9 pl-3 text-sm font-medium text-neutral-700 transition-colors data-highlighted:bg-primary-50 data-highlighted:text-primary-700 data-selected:bg-primary-50 data-selected:font-semibold data-selected:text-primary-700 [&_svg]:text-primary-600"
            >
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export function DoctorBasicInfoSection({
  control, specialties, cities,
}: {
  control: DoctorFormControl;
  specialties: readonly string[];
  cities: readonly string[];
}) {
  return (
    <Section title="اطلاعات پایه" subtitle="اطلاعات هویتی و تخصصی دکتر" icon={User}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField control={control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>نام و نام خانوادگی *</FormLabel>
            <FormControl><Input {...field} placeholder="دکتر محمد محمدی" /></FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="specialty" render={({ field }) => (
          <FormItem>
            <FormLabel>تخصص *</FormLabel>
            <FormControl>
              <FormCombobox
                items={specialties}
                value={field.value}
                onChange={field.onChange}
                placeholder="انتخاب تخصص..."
                emptyText="تخصصی یافت نشد."
                icon={Stethoscope}
              />
            </FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="experience" render={({ field }) => (
          <FormItem>
            <FormLabel>سابقه (سال) *</FormLabel>
            <FormControl>
              <Input {...field} value={field.value == null ? "" : String(field.value)} type="number" min={0} max={70} placeholder="۱۵" />
            </FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="medicalCode" render={({ field }) => (
          <FormItem>
            <FormLabel>کد نظام پزشکی *</FormLabel>
            <FormControl><Input {...field} placeholder="12345" /></FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="gender" render={({ field }) => (
          <FormItem>
            <FormLabel>جنسیت *</FormLabel>
            {/* 🎯 No mt-1: control top edge now matches the gap-2 rhythm of sibling inputs */}
            <div className="flex gap-3">
              {GENDERS.map(({ value, label }) => (
                <Button
                  key={value}
                  type="button"
                  variant={field.value === value ? "subtle" : "outline"}
                  onClick={() => field.onChange(value)}
                  className="flex-1"
                >
                  {label}
                </Button>
              ))}
            </div>
            {/* 📐 Symmetric reserved slot — keeps gender aligned with city's reserved space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="city" render={({ field }) => (
          <FormItem>
            <FormLabel>شهر *</FormLabel>
            <FormControl>
              <FormCombobox
                items={cities}
                value={field.value}
                onChange={field.onChange}
                placeholder="انتخاب شهر..."
                emptyText="شهری یافت نشد."
                icon={MapPin}
              />
            </FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="address" render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>آدرس *</FormLabel>
            <FormControl><Input {...field} placeholder="تهران، خیابان ولیعصر، پلاک ..." /></FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />

        <FormField control={control} name="about" render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>درباره دکتر <span className="text-xs font-normal text-neutral-400">(اختیاری)</span></FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} placeholder="توضیحات کوتاه درباره تخصص و سابقه..." />
            </FormControl>
            {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
            <div className="min-h-5"><FormMessage /></div>
          </FormItem>
        )} />
      </div>
    </Section>
  );
}
