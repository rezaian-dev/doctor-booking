// Client Component — receives plain data, renders swiper internally
'use client';

import SwiperSection from '@/components/shared/swiper-section';
import UserTestimonialCard from './user-testimonial-card';

export interface ReviewItem {
  _id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  doctorName: string;
  doctorLink: string;
  date: string;
}

// 🔒 Tehran TZ pinned — client components are SSR-prerendered too, so server &
//    client must format identically (Node ICU ↔ browser) to avoid hydration drift
function formatDateClient(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Tehran',
    });
  } catch {
    return '';
  }
}

export default function UserTestimonialsCarousel({ items }: { items: ReviewItem[] }) {
  return (
    <SwiperSection
      title="نظرات کاربران"
      viewAllHref="/doctors"
      items={items}
      renderItem={(r: ReviewItem) => (
        <UserTestimonialCard
          userName={r.userName}
          userImage={r.userAvatar || ''}
          rating={r.rating}
          date={formatDateClient(r.date)}
          comment={r.comment}
          doctorName={r.doctorName}
          doctorLink={r.doctorLink}
          className="rounded-xl border border-neutral-100 p-6"
        />
      )}
      getItemKey={(r: ReviewItem) => r._id}
      containerClassName="container px-4 md:px-8 mt-7.5 md:mt-[94px]"
    />
  );
}
