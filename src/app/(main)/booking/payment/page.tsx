export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import PageTitle from "@/components/shared/page-title";
import BookingAlert from "@/components/features/booking/booking-alert";
import ProfileCard from "@/components/shared/profile-card";
import PaymentNotice from "@/components/features/booking/payment-notice";
import PaymentSummary from "@/components/features/booking/payment-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/utils/seo";
import { toProfileCardData } from "@/lib/utils/profile-card";
import { fetchDoctorById } from "@/lib/services/doctors";
import { paymentParamsSchema } from "@/lib/validations/booking";

export const metadata = pageMetadata({
  title: "پرداخت | دکتر رزرو",
  description: "پرداخت هزینه ویزیت.",
  robots: { index: false, follow: false },
});

type Props = { searchParams: Promise<Record<string, string | undefined>> };

// 🩺 Stable shell — the page title renders synchronously in the first HTML paint (the /faq
//    contract). Only the doctor data + slot guard suspend in a local <Suspense> with a
//    grid-matched skeleton → no route-level empty boundary on reload. 🧠✨
export default function PaymentPage({ searchParams }: Props) {
  return (
    <>
      {/* 🔒 animate=false → static title baked into SSR HTML, zero entrance flash */}
      <PageTitle title="پرداخت و ثبت رزرو" hasPadding animate={false} />

      <div className="container px-4 my-6 md:px-8">
        <div className="grid grid-cols-12 gap-x-5">
          <Suspense fallback={<PaymentSkeleton />}>
            <PaymentDetail searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// ⏳ The ONLY data-driven part — validates params, loads the doctor, guards the slot.
async function PaymentDetail({ searchParams }: Props) {
  const result = paymentParamsSchema.safeParse(await searchParams);
  if (!result.success) {
    console.warn("[payment] invalid search params →", result.error.flatten().fieldErrors);
    notFound();
  }

  const { doctorId, date, time, displayDate, displayTime, patientName, patientPhone, forSelf } = result.data;
  const doctor = await fetchDoctorById(doctorId);
  if (!doctor) notFound();

  // 🛑 Guard: the chosen slot must still be open (→ back to doctor page if taken)
  const slotAvailable = doctor.schedule?.some((s) => s.date === date && s.times.includes(time));
  if (!slotAvailable) redirect(`/doctors/${doctorId}?slotTaken=1`);

  const visitType = doctor.hasInPersonVisit ? "حضوری" : doctor.hasOnlineVisit ? "آنلاین" : "—";

  return (
    <>
      <div className="space-y-6 col-span-12 lg:col-span-7 xl:col-span-8">
        <BookingAlert />
        <ProfileCard
          mode="payment"
          data={toProfileCardData(doctor, {
            nextAvailableSlot: `${displayDate} - ساعت ${displayTime}`,
            visitFee: doctor.visitFee,
            visitType,
            patientName,
          })}
        />
        <PaymentNotice />
      </div>

      <div className="col-span-12 lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
        <PaymentSummary
          doctorId={doctorId}
          date={date}
          time={time}
          displayDate={displayDate}
          displayTime={displayTime}
          patientName={patientName}
          patientPhone={patientPhone}
          bookedForSelf={forSelf === "1"}
          visitFee={doctor.visitFee ?? 0}
        />
      </div>
    </>
  );
}

// 🦴 Skeleton mirrors the two grid columns 1:1 → zero layout shift when data arrives.
function PaymentSkeleton() {
  return (
    <>
      <div className="space-y-6 col-span-12 lg:col-span-7 xl:col-span-8">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
      <div className="col-span-12 lg:col-span-5 xl:col-span-4 mt-6 lg:mt-0">
        <Skeleton className="h-112 w-full rounded-xl" />
      </div>
    </>
  );
}
