import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import DoctorReview from '@/components/features/review/doctor-review';
import { fetchDoctorById } from '@/lib/services/doctors';
import { getAuthUser } from '@/lib/auth/session';
import { submitReview } from '@/lib/actions/review-submit';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "ثبت نظر" }; // 🏷️ root template appends " | دکتر رزرو" once
}

export default async function CommentPage({ params }: Props) {
  const { id } = await params;

  // 🔐 Auth guard: only logged-in users can submit reviews
  const user = await getAuthUser();
  if (!user) {
    redirect(`/auth/login?callbackUrl=/doctors/${id}/comment`);
  }

  const doctor = await fetchDoctorById(id);
  if (!doctor) notFound();

  // 🔒 One review per user per doctor — if already reviewed, the form is locked
  //    (the server action enforces this too; this just avoids a blank form). 🧠
  const alreadyReviewed = doctor.reviews.some((r) => r.userId === user._id);

  const doctorData = {
    name:              doctor.name,
    specialty:         doctor.specialty,
    image:             doctor.photo || '/images/no-image.png',
    rating:            doctor.avgRating,
    reviewsCount:      doctor.reviewCount,
    medicalCode:       doctor.medicalCode,
    address:           doctor.address,
    nextAvailableSlot: doctor.nextAvailableSlot ?? '',
    bio:               doctor.about,
  };

  // 🔗 Bind doctor ID so the component doesn't need to know it
  const boundSubmitReview = submitReview.bind(null, id);

  return (
    <DoctorReview
      doctorData={doctorData}
      onSubmitReview={boundSubmitReview}
      isLoggedIn={true}
      alreadyReviewed={alreadyReviewed}
      backHref={`/doctors/${id}`}
    />
  );
}
