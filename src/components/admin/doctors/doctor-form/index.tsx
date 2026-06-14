// 🩺 Doctor create/edit form — the single entry point. RHF + zod own every field (one
//    source of truth, no scattered useState/DOM reads); sections live in focused
//    subcomponents so this file stays a thin orchestrator (model + submit + composition).
"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, CalendarDays, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button, ButtonLink } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import SchedulePicker from "@/components/admin/doctors/schedule-picker";
import { DoctorFormSchema, type DoctorFormFields } from "@/lib/validations/doctor";
import type { DoctorFormState } from "@/lib/actions/doctors";
import { DOCTOR_FILTERS } from "@/lib/constants/filters";
import { isPastJalaliDate } from "@/hooks/use-jalaali";

import { Section, type DoctorFormInput } from "./section";
import { DoctorPhotoSection } from "./photo-section";
import { DoctorBasicInfoSection } from "./basic-info-section";
import { DoctorVisitSection } from "./visit-section";
import { DoctorContactSection } from "./contact-section";

/* ── Option lists (specialties & insurances stay in constants; city comes from DB) ─── */
const labels = (id: string) =>
  (DOCTOR_FILTERS.find((f) => f.id === id)?.options ?? []).map((o) => o.label);
const SPECIALTY_LABELS = labels("specialties");
const INSURANCE_LABELS = labels("insurances");

/* ── Props ─────────────────────────────────────────────────────────────────── */
interface DoctorData {
  name?: string;
  specialty?: string;
  experience?: number;
  about?: string;
  medicalCode?: string;
  address?: string;
  city?: string;
  gender?: string;
  photo?: string;
  visitFee?: number;
  hasOnlineVisit?: boolean;
  hasInPersonVisit?: boolean;
  acceptedInsurances?: string[];
  contact?: { phone?: string; website?: string; instagram?: string };
  schedule?: { date: string; times: string[] }[];
}

interface DoctorFormProps {
  action: (state: DoctorFormState, formData: FormData) => Promise<DoctorFormState>;
  initialData?: DoctorData;
  title: string;
  cityLabels: readonly string[]; // 🏙️ DB-sourced city labels (provided by the server page)
}

/* ── Component ────────────────────────────────────────────────────────────────── */
export default function DoctorForm({ action, initialData = {}, title, cityLabels }: DoctorFormProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<DoctorFormInput, unknown, DoctorFormFields>({
    resolver: zodResolver(DoctorFormSchema),
    defaultValues: {
      name: initialData.name ?? "",
      specialty: initialData.specialty ?? "",
      experience: initialData.experience ?? 0,
      medicalCode: initialData.medicalCode ?? "",
      city: initialData.city ?? "",
      address: initialData.address ?? "",
      about: initialData.about ?? "",
      visitFee: initialData.visitFee ?? 0,
      phone: initialData.contact?.phone ?? "",
      website: initialData.contact?.website ?? "",
      instagram: initialData.contact?.instagram ?? "",
      gender: initialData.gender === "female" ? "female" : "male",
      photo: initialData.photo ?? "",
      hasInPersonVisit: initialData.hasInPersonVisit ?? true,
      hasOnlineVisit: initialData.hasOnlineVisit ?? false,
      acceptedInsurances: initialData.acceptedInsurances ?? [],
      schedule: (initialData.schedule ?? []).map((s) => ({ date: s.date, times: s.times })),
    },
  });

  const { control, handleSubmit, setValue, watch, setError, formState: { isSubmitting } } = form;
  const photo = watch("photo");

  /* ── Photo upload ────────── */
  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم تصویر باید کمتر از ۲ مگابایت باشد");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "doctors");
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) {
        setValue("photo", json.url);
        toast.success("تصویر آپلود شد");
      } else {
        toast.error(json.error ?? "خطا در آپلود");
      }
    } catch {
      toast.error("خطا در آپلود تصویر");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handlePhotoRemove() {
    setValue("photo", "", { shouldDirty: true });
    if (fileRef.current) fileRef.current.value = "";
  }

  /* ── Submit ───── */
  const onValid = async (data: DoctorFormFields) => {
    const fd = new FormData();
    fd.set("name", data.name);
    fd.set("specialty", data.specialty);
    fd.set("experience", String(data.experience));
    fd.set("medicalCode", data.medicalCode);
    fd.set("city", data.city);
    fd.set("address", data.address);
    fd.set("about", data.about ?? "");
    fd.set("visitFee", String(data.visitFee));
    fd.set("gender", data.gender);
    fd.set("photo", data.photo);
    fd.set("hasInPersonVisit", String(data.hasInPersonVisit));
    fd.set("hasOnlineVisit", String(data.hasOnlineVisit));
    fd.set("acceptedInsurances", data.acceptedInsurances.join(", "));
    fd.set("phone", data.phone ?? "");
    fd.set("website", data.website ?? "");
    fd.set("instagram", data.instagram ?? "");
    const schedule = data.schedule
      .filter((s) => s.date && !isPastJalaliDate(s.date))
      .map((s) => `${s.date},${s.times.join(",")}`)
      .join("\n");
    fd.set("schedule", schedule);

    const result = await action({}, fd);
    if (result?.error) toast.error(result.error);
    if (result?.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof DoctorFormFields, { message });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onValid)} className="space-y-5">
        <DoctorPhotoSection
          photo={photo}
          uploading={uploading}
          fileRef={fileRef}
          onUpload={handlePhotoUpload}
          onRemove={handlePhotoRemove}
        />

        <DoctorBasicInfoSection control={control} specialties={SPECIALTY_LABELS} cities={cityLabels} />

        <DoctorVisitSection control={control} insurances={INSURANCE_LABELS} />

        <DoctorContactSection control={control} />

        {/* 📅 Schedule */}
        <Section title="برنامه کاری" subtitle="تاریخ و ساعت‌های ویزیت دکتر را مشخص کنید" icon={CalendarDays}>
          <FormField control={control} name="schedule" render={({ field }) => (
            <SchedulePicker value={field.value} onChange={field.onChange} />
          )} />
        </Section>

        {/* ── Actions bar ─────────────────────────────────────────────────── */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
          {/* left hint */}
          <p className="hidden text-xs text-neutral-400 sm:block">
            {isSubmitting ? "در حال ذخیره..." : "تمام فیلدهای ستاره‌دار اجباری هستند"}
          </p>

          <div className="flex gap-2 mr-auto">
            {/* 🔗 Client-side nav — ButtonLink avoids the Slot+next/link hydration mismatch */}
            <ButtonLink
              href="/admin/doctors"
              variant="outline"
              className="gap-1.5 rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            >
              <X size={14} />
              انصراف
            </ButtonLink>
            <Button
              type="submit"
              disabled={isSubmitting || uploading}
              className="gap-2 rounded-xl px-6 font-semibold shadow-sm"
            >
              {isSubmitting
                ? <LoaderCircle size={15} className="animate-spin" />
                : <Save size={15} />
              }
              {title}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
