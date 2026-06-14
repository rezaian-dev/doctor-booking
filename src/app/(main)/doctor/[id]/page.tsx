import { redirect } from "next/navigation";

// 🔄 Redirect /doctor/[id] → /doctors/[id] for backward compatibility
export default async function DoctorRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/doctors/${id}`);
}
