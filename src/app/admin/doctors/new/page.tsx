// ➕ Create doctor. Auth handled by the route layout.
import type { Metadata } from "next";
import DoctorForm from "@/components/admin/doctors/doctor-form";
import { createDoctor } from "@/lib/actions/doctors";
import { getCityLabels } from "@/lib/services/cities";

export const metadata: Metadata = {
  title: "پزشک جدید | پنل ادمین",
  robots: { index: false, follow: false },
};

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function NewDoctorPage() {
  const cityLabels = await getCityLabels(); // 🏙️ DB-sourced city options
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">افزودن دکتر جدید</h1>
        <p className="mt-1 text-sm text-neutral-500">اطلاعات دکتر را تکمیل کنید</p>
      </div>
      {/* 🏥 createDoctor server action */}
      <DoctorForm action={createDoctor} title="ثبت دکتر" cityLabels={cityLabels} />
    </div>
  );
}
