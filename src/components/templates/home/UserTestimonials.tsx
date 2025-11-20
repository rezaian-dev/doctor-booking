'use client';
import clsx from 'clsx';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import UserTestimonialCard from './UserTestimonialCard';

// 🧾 HomeUserTestimonials – A responsive, accessible testimonial carousel
// ✅ RTL-ready | ✅ a11y-compliant | ✅ mobile-first | ✅ Swiper-powered
const HomeUserTestimonials: React.FC = () => {
  // 🧠 Track swiper boundaries for conditional navigation
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // 🔄 Update nav state on slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 🎯 Manual slide control
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  // 💬 Static testimonials – replace with API later
  const testimonials = [
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
  ] as const;

  return (
    <section className="container px-4 md:px-8 mt-7.5 md:mt-[94px]">
      {/* 🧭 Header: Title + "View All" */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
          نظرات کاربران
        </h2>

        <div className="flex items-center gap-x-1.5">
          <Link
            href="/doctors"
            className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 focus:text-neutral-700 transition-colors whitespace-nowrap"
            aria-label="View all doctors"
          >
            مشاهده همه
          </Link>
          <MdOutlineKeyboardArrowLeft
            size={20}
            className="text-neutral-400"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* 🎠 Swiper Testimonial Carousel */}
      <div className="mt-[18px] relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={16}
          watchOverflow
          onSwiper={swiper => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 }, // sm
            768: { slidesPerView: 2, spaceBetween: 20 }, // md
            1024: { slidesPerView: 3, spaceBetween: 24 }, // lg
          }}
          className="pb-6"
        >
          {testimonials.map(testimonial => (
            <SwiperSlide key={testimonial.id}>
              <UserTestimonialCard {...testimonial} className="rounded-xl border border-neutral-100 p-6" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ◀️ Prev Button (RTL: placed on RIGHT) */}
        {!isBeginning && (
          <button
            onClick={handlePrev}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'bg-white/80 backdrop-blur-sm text-gray-700',
              'hover:bg-white hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'right-0 sm:-right-3 md:-right-4'
            )}
            aria-label="Previous testimonial"
          >
            <MdOutlineKeyboardArrowRight size={20} />
          </button>
        )}

        {/* ▶️ Next Button (RTL: placed on LEFT) */}
        {!isEnd && (
          <button
            onClick={handleNext}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'bg-white/80 backdrop-blur-sm text-gray-700',
              'hover:bg-white hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'left-0 sm:-left-3 md:-left-4'
            )}
            aria-label="Next testimonial"
          >
            <MdOutlineKeyboardArrowLeft size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default HomeUserTestimonials;
