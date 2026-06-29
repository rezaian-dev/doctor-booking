import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import DoctorReview from '@/components/features/review/doctor-review';
import { fetchDoctorHeader, hasUserReviewed } from '@/lib/services/doctors';
import type { DoctorData } from '@/types/doctor';
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

  // 🪶 The review form's header only shows name/specialty/photo — fetch just that, plus a
  //    targeted "already reviewed?" check, in parallel. Far less DB work & bandwidth than
  //    loading the entire doctor with all reviews + avatars. ⚡
  const [doctor, alreadyReviewed] = await Promise.all([
    fetchDoctorHeader(id),
    hasUserReviewed(id, user._id),
  ]);
  if (!doctor) notFound();

  // 🧾 Only name/specialty/image are rendered; the rest satisfy the shared DoctorData shape.
  const doctorData: DoctorData = {
    name:         doctor.name,
    specialty:    doctor.specialty,
    image:        doctor.photo || '/images/no-image.png',
    rating:       0,
    reviewsCount: 0,
    medicalCode:  '',
    address:      '',
    bio:          '',
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
