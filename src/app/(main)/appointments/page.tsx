import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getAppointments, cancelAppointment } from "@/lib/actions/appointment";
import { formatSlot, APPOINTMENTS_PAGE_SIZE } from "@/lib/utils/appointments";
import ProfileCard from "@/components/shared/profile-card";
import AppointmentsPagination from "@/components/features/appointments/appointments-pagination";
import AppointmentsEmptyState from "@/components/features/appointments/appointments-empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/utils/seo";

// 🔑 force-dynamic: reads auth cookies via getAppointments() — must render per-request.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "نوبت‌های من",
  robots: { index: false, follow: false },
});

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

// 🩺 Stable shell — back-link + heading render synchronously in the first HTML paint (the /faq
//    contract). Only the appointment list (which reads auth cookies) suspends behind a skeleton
//    → no route-level empty boundary on reload. 🧠✨
export default function AppointmentsPage({ searchParams }: PageProps) {
  return (
    // 🧱 No <main> here — StandardLayout (via the (main) group) already provides it.
    <div className="min-h-screen">
      <div className="container px-4 md:px-8 py-6">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </Link>

        <h1 className="text-xl font-bold text-neutral-900 mb-6">نوبت‌های من</h1>

        <Suspense fallback={<AppointmentsSkeleton />}>
          <AppointmentsList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// ⏳ The ONLY data-driven part — reads auth cookies, paginates & renders the cards.
async function AppointmentsList({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const { data: allAppointments = [], error } = await getAppointments();

  const totalPages = Math.ceil(allAppointments.length / APPOINTMENTS_PAGE_SIZE);
  const appointments = allAppointments.slice(
    (currentPage - 1) * APPOINTMENTS_PAGE_SIZE,
    currentPage * APPOINTMENTS_PAGE_SIZE,
  );

  if (error) return <div className="text-center text-red-400 py-16 text-sm">{error}</div>;
  if (allAppointments.length === 0) return <AppointmentsEmptyState />;

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-4">
        {appointments.map((appt) => (
          <ProfileCard
            key={appt._id}
            mode="appointment"
            data={{
              name:              appt.doctor.name,
              specialty:         appt.doctor.specialty,
              image:             appt.doctor.photo || "/images/no-image.png",
              address:           appt.doctor.city,
              rating:            0,
              reviewsCount:      0,
              medicalCode:       "",
              bio:               "",
              nextAvailableSlot: formatSlot(appt.date, appt.time),
              appointmentStatus: appt.status,
              appointmentId:     appt._id,
              trackingCode:      appt.trackingCode,
              // 🧑‍⚕️ Surface who the visit is for → drives the "برای دیگری" badge
              patientName:       appt.patientName,
              bookedForSelf:     appt.bookedForSelf,
            }}
            cancelAction={cancelAppointment.bind(null, appt._id)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <AppointmentsPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
}

// 🦴 Skeleton — mirrors the COMPACT appointment card 1:1 (avatar + info + status)
//    so the swap to real data has zero layout shift, from 320px up. ✨
function AppointmentsSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-neutral-100 bg-white p-3 sm:gap-4 sm:p-4">
          <Skeleton className="size-16 shrink-0 rounded-xl xs:size-20" />
          <div className="flex min-w-0 flex-1 flex-col gap-y-2">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-32 max-w-full rounded-full" />
              <Skeleton className="h-5 w-14 shrink-0 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-24 rounded-full" />
            <Skeleton className="h-3.5 w-28 rounded-full" />
            <Skeleton className="mt-1 h-7 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
