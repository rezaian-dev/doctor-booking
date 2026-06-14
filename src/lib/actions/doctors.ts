// 🏥 Server Actions — create/update doctor — Zod v4
"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";
import { DoctorServerSchema, mapZodIssues } from "@/lib/validations/doctor";

// 🔄 Revalidate the ISR routes that show doctors so new/edited content appears at once
function revalidateDoctors() {
  revalidateTag("doctors", { expire: 0 }); // 🏷️⏱️ immediately bust cached homepage doctor cards (Next 16 needs a profile)
  revalidatePath("/");
  revalidatePath("/doctors");
}

/* ── Form state type ─────────────────────────────────────────────────────── */
export type DoctorFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

/* ── Parse FormData → raw object ─────────────────────────────────────────── */
function parseForm(formData: FormData) {
  const scheduleRaw = formData.get("schedule") as string;
  const schedule = scheduleRaw
    ? scheduleRaw.split("\n").map((l) => l.trim()).filter(Boolean)
        .map((line) => {
          const parts = line.split(",").map((s) => s.trim());
          const [date, ...times] = parts;
          return { date: date ?? "", times: times.filter(Boolean) };
        })
        .filter((s) => s.date)
    : [];

  const insurances =
    (formData.get("acceptedInsurances") as string)
      ?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  return {
    name: (formData.get("name") as string) ?? "",
    specialty: (formData.get("specialty") as string) ?? "",
    experience: Number(formData.get("experience")) || 0,
    about: (formData.get("about") as string) || undefined,
    medicalCode: (formData.get("medicalCode") as string) ?? "",
    address: (formData.get("address") as string) ?? "",
    city: (formData.get("city") as string) ?? "",
    gender: ((formData.get("gender") as string) ?? "male") as "male" | "female",
    photo: (formData.get("photo") as string) || undefined,
    visitFee: Number(formData.get("visitFee")) || 0,
    // ✅ Hidden inputs send "true"/"false" strings
    hasInPersonVisit: formData.get("hasInPersonVisit") === "true",
    hasOnlineVisit: formData.get("hasOnlineVisit") === "true",
    acceptedInsurances: insurances,
    contact: {
      phone: (formData.get("phone") as string) ?? "",
      website: (formData.get("website") as string) ?? "",
      instagram: (formData.get("instagram") as string) ?? "",
    },
    schedule,
  };
}

/* ── Create Doctor ───────────────────────────────────────────────────────── */
export async function createDoctor(
  _: DoctorFormState,
  formData: FormData
): Promise<DoctorFormState> {
  const raw = parseForm(formData);
  const parsed = DoctorServerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      // ✅ v4: .issues not .errors
      error: parsed.error.issues[0]?.message ?? "خطای اعتبارسنجی",
      fieldErrors: mapZodIssues(parsed.error.issues),
    };
  }

  await connectDB();
  const exists = await Doctor.exists({ medicalCode: parsed.data.medicalCode });
  if (exists) return { error: "کد نظام پزشکی تکراری است" };

  await Doctor.create(parsed.data);
  revalidateDoctors();
  redirect("/admin/doctors");
}

/* ── Update Doctor ───────────────────────────────────────────────────────── */
export async function updateDoctor(
  id: string,
  _: DoctorFormState,
  formData: FormData
): Promise<DoctorFormState> {
  const raw = parseForm(formData);
  const parsed = DoctorServerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "خطای اعتبارسنجی",
      fieldErrors: mapZodIssues(parsed.error.issues),
    };
  }

  await connectDB();
  await Doctor.findByIdAndUpdate(id, { $set: parsed.data });
  revalidateDoctors();
  redirect("/admin/doctors");
}
