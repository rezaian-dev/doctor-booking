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
import DoctorCard from '../../DoctorCard';
import SwiperSection from '@/components/SwiperSection';

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
    <section className="container px-4 md:px-8 mt-7.5 md:mt-23.5">
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
     <SwiperSection
      title={title}
      viewAllHref="/doctors"
      viewAllLabel="مشاهده همه"
      items={doctors}
      renderItem={(doctor) => <DoctorCard {...doctor} />}
      getItemKey={(doctor) => doctor.id}
    />
    </section>
  );
};

export default DoctorSection;
