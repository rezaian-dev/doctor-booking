// ✏️ Edit doctor. Auth handled by the route layout; data fetched via the service.
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DoctorForm from "@/components/admin/doctors/doctor-form";
import { getDoctorForEdit } from "@/lib/services/admin-doctors";
import { updateDoctor } from "@/lib/actions/doctors";
import { getCityLabels } from "@/lib/services/cities";
import type { DoctorFormState } from "@/lib/actions/doctors";

export const metadata: Metadata = {
  title: "ویرایش پزشک | پنل ادمین",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

// 🔒 Admin is always per-request & auth-gated — never prerender at build (no DB at build time).
export const dynamic = "force-dynamic";

export default async function EditDoctorPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await getDoctorForEdit(id);
  if (!doc) notFound();

  const cityLabels = await getCityLabels(); // 🏙️ DB-sourced city options

  // 🔗 Bind doctor id to the update action
  const boundAction = async (
    state: DoctorFormState,
    formData: FormData,
  ): Promise<DoctorFormState> => {
    "use server";
    return updateDoctor(id, state, formData);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">ویرایش دکتر</h1>
        <p className="mt-1 text-sm text-neutral-500">{doc.name}</p>
      </div>
      <DoctorForm action={boundAction} initialData={doc} title="ذخیره تغییرات" cityLabels={cityLabels} />
    </div>
  );
}
