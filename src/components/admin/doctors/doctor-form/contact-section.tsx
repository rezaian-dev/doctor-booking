// ☎️ Optional contact fields — rendered from a small config map to kill repeated JSX.
"use client";

import { Phone } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Section, type DoctorFormControl } from "./section";

// 🗂️ Contact field definitions — one row each
const CONTACT_FIELDS = [
  { name: "phone", label: "تلفن", placeholder: "02188001122" },
  { name: "website", label: "وب‌سایت", placeholder: "https://example.com" },
  { name: "instagram", label: "اینستاگرام", placeholder: "dr.example" },
] as const;

export function DoctorContactSection({ control }: { control: DoctorFormControl }) {
  return (
    <Section title="اطلاعات تماس" subtitle="اختیاری — برای نمایش در پروفایل" icon={Phone}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CONTACT_FIELDS.map(({ name, label, placeholder }) => (
          <FormField key={name} control={control} name={name} render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl><Input {...field} placeholder={placeholder} /></FormControl>
              {/* 📐 Reserved one-line slot — message fades in here, never claims new space */}
              <div className="min-h-5"><FormMessage /></div>
            </FormItem>
          )} />
        ))}
      </div>
    </Section>
  );
}
