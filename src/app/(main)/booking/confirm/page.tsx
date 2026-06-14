export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageTitle from "@/components/shared/page-title";
import ProfileCard from "@/components/shared/profile-card";
import PatientSelector from "@/components/features/booking/patient-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/utils/seo";
import { toProfileCardData } from "@/lib/utils/profile-card";
import { fetchDoctorById } from "@/lib/services/doctors";
import { getAuthUser } from "@/lib/auth/session";
import { confirmParamsSchema } from "@/lib/validations/booking";

export const metadata = pageMetadata({
  title: "تایید نوبت | دکتر رزرو",
  description: "تایید نوبت پزشک.",
  robots: { index: false, follow: false },
});

type Props = { searchParams: Promise<Record<string, string | undefined>> };

// 🩺 Stable shell — the page title renders synchronously in the first HTML paint (the /faq
//    contract). Only the doctor/auth data suspends in a local <Suspense> with a layout-matched
//    skeleton → no route-level empty boundary on reload. 🧠✨
export default function ConfirmPage({ searchParams }: Props) {
  return (
    <>
      <div className="container px-4 md:px-8">
        <div className="max-w-201.25 mx-auto">
          {/* 🔒 animate=false → static title baked into SSR HTML, zero entrance flash */}
          <PageTitle title="انتخاب مراجعه‌کننده" hasPadding={false} animate={false} />
        </div>
      </div>

      <div className="container px-4 mt-6 mb-10 md:my-6 md:px-8">
        <div className="max-w-201.25 mx-auto space-y-6">
          <Suspense fallback={<ConfirmSkeleton />}>
            <ConfirmDetail searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// ⏳ The ONLY data-driven part — validates params, loads the doctor + current user.
async function ConfirmDetail({ searchParams }: Props) {
  const result = confirmParamsSchema.safeParse(await searchParams);
  if (!result.success) {
    console.warn("[confirm] invalid params →", result.error.flatten().fieldErrors);
    notFound();
  }

  const { doctorId, date, time, displayDate, displayTime } = result.data;
  const [doctor, user] = await Promise.all([fetchDoctorById(doctorId), getAuthUser()]);
  if (!doctor) notFound();

  // 👤 Logged-in user prefilled, otherwise a guest placeholder
  const currentUser = user
    ? { name: `${user.firstName} ${user.lastName}`, phone: user.phone }
    : { name: "کاربر مهمان", phone: "" };

  return (
    <>
      <ProfileCard
        mode="confirm"
        data={toProfileCardData(doctor, {
          nextAvailableSlot: doctor.nextAvailableSlot ?? "نوبت خالی موجود نیست",
        })}
      />
      <PatientSelector
        currentUser={currentUser}
        doctorId={doctorId}
        date={date}
        time={time}
        displayDate={displayDate}
        displayTime={displayTime}
      />
    </>
  );
}

// 🦴 Skeleton — same two-block rhythm (doctor card + patient form) → no layout shift.
function ConfirmSkeleton() {
  return (
    <>
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </>
  );
}
