import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import PageTitle from "@/components/shared/page-title";
import ProfileCard from "@/components/shared/profile-card";
import { ProfileCardSkeleton } from "@/components/shared/profile-card-skeleton";
import Contact from "@/components/features/booking/contact";
import BookingCalendar from "@/components/features/booking/booking-calendar";
import Reviews from "@/components/shared/reviews";
import { Skeleton } from "@/components/ui/skeleton";
import { pageMetadata } from "@/lib/utils/seo";
import { toProfileCardData } from "@/lib/utils/profile-card";
import { fetchDoctorById } from "@/lib/services/doctors";
import { getAuthUser } from "@/lib/auth/session";

// 🔑 force-dynamic: reads auth cookies + fresh doctor data per request
export const dynamic = "force-dynamic";

// 🧠 Memoize per-request → generateMetadata + the page share ONE DB read (no waterfall)
const getDoctor = cache(fetchDoctorById);

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await getDoctor(id).catch(() => null);

  // 🛟 Fallback metadata when the doctor can't be loaded
  if (!doctor) {
    return pageMetadata({
      title: "پروفایل پزشک | دکتر رزرو",
      description: "مشاهده پروفایل پزشک و رزرو نوبت آنلاین در دکتر رزرو",
      canonical: `/doctors/${id}`,
    });
  }

  const title = `${doctor.name}${doctor.specialty ? ` | ${doctor.specialty}` : ""} | دکتر رزرو`;
  const description =
    (doctor.about?.trim() || `رزرو نوبت آنلاین ${doctor.name}، ${doctor.specialty}. مشاهده پروفایل، نظرات و زمان‌های خالی.`).slice(0, 160);

  return pageMetadata({
    title,
    description,
    canonical: `/doctors/${id}`,
    ogType: "profile",
    keywords: [doctor.name, doctor.specialty, "رزرو نوبت", "پزشک متخصص"],
    // 🖼️ Use the doctor's own photo as the share card when available
    ...(doctor.photo ? { images: [{ url: doctor.photo, alt: doctor.name }] } : {}),
  });
}

// 🩺 Stable shell — renders synchronously so the title + grid scaffold land in the first
//    HTML paint (the /faq contract). Only the doctor data suspends, in a local <Suspense>
//    with a layout-matched skeleton → no route-level empty boundary on reload. 🧠✨
export default function DoctorPage({ params }: Props) {
  return (
    <>
      {/* 🔒 animate=false → static title, baked into SSR HTML, zero entrance flash */}
      <PageTitle title="لیست پزشکان" hasPadding animate={false} />

      <div className="container px-4 md:px-8 mt-8">
        <div className="grid grid-cols-12 gap-x-5">
          <Suspense fallback={<DoctorDetailSkeleton />}>
            <DoctorDetail params={params} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// ⏳ The ONLY data-driven part — awaits the doctor + auth, then fills the grid columns.
async function DoctorDetail({ params }: Props) {
  const { id } = await params;
  // ✅ Parallel fetch — no waterfall (doctor read is shared with generateMetadata)
  const [doctor, user] = await Promise.all([getDoctor(id), getAuthUser()]);
  if (!doctor) notFound();

  // 🔒 Has the signed-in user already reviewed this doctor? (no extra DB read —
  //    reviews already carry userId). Drives the "submit review" CTA state. 🧠
  const hasReviewed = !!user && doctor.reviews.some((r) => r.userId === user._id);

  return (
    <>
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <ProfileCard
          mode="default"
          data={toProfileCardData(doctor, {
            // 🧷 exactOptionalPropertyTypes: add the key only when a slot exists
            ...(doctor.nextAvailableSlot != null && {
              nextAvailableSlot: doctor.nextAvailableSlot,
            }),
          })}
        />
        {/* 📞 Contact rendered only when data is present */}
        {doctor.contact && <Contact data={doctor.contact} />}
      </div>

      <div className="col-span-12 lg:col-span-5 xl:col-span-4">
        <BookingCalendar schedule={doctor.schedule} doctorId={doctor._id} isLoggedIn={!!user} />
      </div>

      <div className="col-span-12 xl:col-span-8 lg:order-1 order-2">
        <Reviews
          reviews={doctor.reviews}
          doctorId={id}
          avgRating={doctor.avgRating}
          reviewCount={doctor.reviewCount}
          recommendPct={doctor.recommendPct}
          hasReviewed={hasReviewed}
        />
      </div>
    </>
  );
}

// 🦴 Skeleton mirrors the grid columns 1:1 → zero layout shift when data arrives.
function DoctorDetailSkeleton() {
  return (
    <>
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <ProfileCardSkeleton />
      </div>
      <div className="col-span-12 lg:col-span-5 xl:col-span-4">
        {/* 🗓️ Booking calendar placeholder */}
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
      <div className="col-span-12 xl:col-span-8 lg:order-1 order-2">
        {/* 💬 Reviews placeholder */}
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </>
  );
}
