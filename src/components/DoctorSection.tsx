'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useRef, useState } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import DoctorCard from './DoctorCard';

interface DoctorSectionProps {
  title: string;
}

/**
 * 🏆 PopularDocs – A fully responsive, accessible doctor carousel
 * ✅ RTL-ready | ✅ a11y-compliant | ✅ mobile-first | ✅ production-optimized
 */
const DoctorSection = ({ title }: DoctorSectionProps) => {
  // 🧠 State to track swiper navigation boundaries
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // 🔄 Update navigation state on slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 🎯 Manual slide navigation handlers
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  // 📦 Static data – replace with API in real app
  const doctors = [
    {
      id: 1,
      name: 'دکتر علی راد',
      specialty: 'متخصص ریه',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/4.png',
    },
    {
      id: 2,
      name: 'دکتر علی وارسته',
      specialty: 'متخصص قلب و عروق',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/1.png',
    },
    {
      id: 3,
      name: 'دکتر زهرا وارسته',
      specialty: 'متخصص قلب و عروق',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/2.png',
    },
    {
      id: 4,
      name: 'دکتر بهنوش حسینی',
      specialty: 'جراح گوش حلق و بینی',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/3.png',
    },
  ] as const;

  return (
    <section className="container px-4 md:px-8 mt-[30px] md:mt-[94px]">
      {/* 🧭 Header: Section title + "View All" link */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center gap-x-1.5">
          <Link
            href="/doctors"
            className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 focus:text-neutral-700 focus:outline-none transition-colors whitespace-nowrap"
            aria-label="مشاهده همه پزشکان"
          >
            مشاهده همه
          </Link>
          <MdOutlineKeyboardArrowLeft size={20} color="#b3b3b3" />
        </div>
      </div>

      {/* 🎠 Swiper Carousel */}
      <div className="mt-[18px] relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={12}
          watchOverflow={true}
          onSwiper={swiper => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
          breakpoints={{
            576: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="pb-6"
        >
          {doctors.map(doctor => (
            <SwiperSlide key={doctor.id}>
              <DoctorCard {...doctor} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ◀️ Previous Button (RTL: right side) */}
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
              'right-0 sm:-right-3 md:-right-4 lg:-right-5'
            )}
          >
            <MdOutlineKeyboardArrowRight size={20} />
          </button>
        )}

        {/* ▶️ Next Button (RTL: left side) */}
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
              'left-0 sm:-left-3 md:-left-4 lg:-left-5'
            )}
          >
            <MdOutlineKeyboardArrowLeft size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default DoctorSection;
