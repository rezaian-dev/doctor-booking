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
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import ArticleCard from '../../ArticleCard';

interface MedicalArticlesProps {
  title?: string;
}

/**
 * 📚 MedicalArticles – Swiper-based article carousel for latest health insights
 * ✅ RTL-ready | ✅ Mobile-first | ✅ Reusable | ✅ Performance-optimized
 */
const MedicalArticles= ({title = 'آخرین مقالات'}:MedicalArticlesProps) => {
  // 🧠 Track swiper navigation state
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<SwiperRef>(null);

  // 🔄 Update nav state on slide change
  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // 🎯 Manual navigation
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  // 📦 Static article data – replace with API later
  const articles = [
    {
      id: 1,
      title: '۱۰ نشانه هشدار دهنده مشکلات قلبی',
      excerpt: 'اگر این ۱۰ نشانه را داشتید حتما به پزشک مراجعه کنید...',
      date: '۱۴۰۳/۰۸/۱۵',
      image: '/images/article-1.png',
      href: '/articles/1',
    },
    {
      id: 2,
      title: '۵ گام ساده برای پیشگیری از دیابت',
      excerpt: '۵ گام ساده برای پیشگیری از دیابت نوع ۲ ...',
      date: '۱۴۰۳/۰۸/۱۰',
      image: '/images/article-2.png',
      href: '/articles/2',
    },
    {
      id: 3,
      title: 'چگونه بهترین دکتر را برای نیازهای خود پیدا کنیم؟',
      excerpt: 'رزرو بهترین دکتر نیازمند یکسری پیشنیاز ها است که باید بدانید...',
      date: '۱۴۰۳/۰۸/۰۵',
      image: '/images/article-3.png',
      href: '/articles/3',
    },
  ] as const;

  return (
    <section className="container px-4 md:px-8 mt-7.5 md:mt-10">
      {/* 🧭 Header: Title + "View All" */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl leading-tight tracking-wide text-neutral-975 line-clamp-2">
          {title}
        </h2>
        <div className="flex items-center gap-x-1.5">
          <Link
            href="/articles"
            className="font-medium text-xs sm:text-sm text-neutral-400 hover:text-neutral-600 focus:text-neutral-700 focus:outline-none transition-colors whitespace-nowrap"
            aria-label="مشاهده همه مقالات"
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

      {/* 🎠 Swiper Carousel for Articles */}
      <div className="mt-[18px] relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={16}
          watchOverflow={true}
          onSwiper={swiper => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={handleSlideChange}
         breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
          }}
          className="pb-6"
        >
          {articles.map(article => (
            <SwiperSlide key={article.id}>
              <ArticleCard {...article} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ◀️ Prev Button (RTL: right side) */}
        {!isBeginning && (
          <button
            onClick={handlePrev}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 z-10',
              'flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'bg-white/80 backdrop-blur-sm text-neutral-700',
              'hover:bg-white hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'right-0 sm:-right-3 md:-right-4'
            )}
            aria-label="اسلاید قبلی"
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
              'bg-white/80 backdrop-blur-sm text-neutral-700',
              'hover:bg-white hover:shadow-md',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-all duration-200 ease-in-out',
              'left-0 sm:-left-3 md:-left-4'
            )}
            aria-label="اسلاید بعدی"
          >
            <MdOutlineKeyboardArrowLeft size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

export default MedicalArticles;
