'use client';

import UserTestimonialCard from './user-testimonial-card';
import SwiperSection from '@/components/shared/swiper-section';

// 💬 Testimonial data type
interface Testimonial {
  id: number;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
  doctorName: string;
  doctorLink: string;
}

/**
 * 🧾 HomeUserTestimonials – Refactored using shared SwiperSection
 * ✅ Clean & DRY | ✅ Type-safe | ✅ Maintainable
 */
const UserTestimonials = () => {
  // 💬 Static testimonials – replace with API in production
  const testimonials: readonly Testimonial[] = [
    {
      id: 1,
      userName: 'حسن احمدی',
      userImage: '/images/user-1.png',
      rating: 5,
      date: '۱۴۰۳/۱۰/۲۰',
      comment: 'دکتر عالی هستند و تشخیص‌تون درست بود و زود خوب شدم.',
      doctorName: 'دکتر زهرا وارسته',
      doctorLink: '#',
    },
    {
      id: 2,
      userName: 'میترا',
      userImage: '/images/user-2.png',
      rating: 3,
      date: '۱۴۰۳/۱۰/۲۰',
      comment:
        'دکتر عالی هستند و تشخیص‌تون درست در اولین معاینه بیماری را تشخیص دادند و با تجویز یک نسخه درمان کردند.',
      doctorName: 'دکتر محمود محمدی',
      doctorLink: '#',
    },
    {
      id: 3,
      userName: 'رها مرادی',
      userImage: '/images/user-3.png',
      rating: 2,
      date: '۱۴۰۳/۱۰/۲۰',
      comment: 'سلام دکتر بسیار خون گرم و مهربون بود.',
      doctorName: 'دکتر زهرا وارسته',
      doctorLink: '#',
    },
    {
      id: 4,
      userName: 'رها مرادی',
      userImage: '/images/user-3.png',
      rating: 2,
      date: '۱۴۰۳/۱۰/۲۰',
      comment: 'سلام دکتر بسیار خون گرم و مهربون بود.',
      doctorName: 'دکتر زهرا وارسته',
      doctorLink: '#',
    },
  ] as const;

  return (
    <SwiperSection
      title="نظرات کاربران"
      viewAllHref="/doctors"
      items={testimonials}
      renderItem={testimonial => (
        <UserTestimonialCard
          {...testimonial}
          className="rounded-xl border border-neutral-100 p-6"
        />
      )}
      getItemKey={testimonial => testimonial.id}
      containerClassName="container px-4 md:px-8 mt-7.5 md:mt-[94px]"
    />
  );
};

export default UserTestimonials;
