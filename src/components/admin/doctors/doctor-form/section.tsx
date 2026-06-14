// 🧩 Shared doctor-form building blocks: <Section> (the card shell — icon + title + body)
//    and shared, strictly-typed RHF control types.
"use client";

import { Card, CardContent } from "@/components/ui/card";

import type { Control } from "react-hook-form";
import type { z } from "zod";
import type { DoctorFormSchema, DoctorFormFields } from "@/lib/validations/doctor";

/* 🔗 One shared control type — sections stay strictly typed without re-deriving it. */
export type DoctorFormInput = z.input<typeof DoctorFormSchema>;
export type DoctorFormControl = Control<DoctorFormInput, unknown, DoctorFormFields>;

/* ── Card shell reused by every section ──────────────────────────────────────── */
export function Section({
  title, subtitle, icon: Icon, children,
}: {
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      {/* 🏷️ Section header */}
      <div className="mb-0 flex items-center gap-3.5 border-b border-neutral-100 p-6 sm:p-7">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary-50 to-primary-100 text-primary-600 shadow-sm">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p>}
        </div>
      </div>
      <CardContent className="p-6 sm:p-7">
        {children}
      </CardContent>
    </Card>
  );
}
