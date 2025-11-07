'use client';

import { Location04Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import clsx from 'clsx';

/**
 * 🧩 DoctorCard – A responsive, accessible, and reusable doctor profile card
 * ✅ RTL-ready | ✅ a11y-compliant | ✅ clsx-powered | ✅ mobile-first
 */
interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  reviewsCount: number;
  city: string;
  image: string;
}

const DoctorCard = ({
  id,
  name,
  specialty,
  rating,
  reviewsCount,
  city,
  image,
}: DoctorCardProps) => {
  return (
    <div
      className={clsx(
        'rounded-xl overflow-hidden',
        'border border-neutral-200 bg-white',
        'transition-shadow duration-200 hover:shadow-sm' // subtle hover effect
      )}
    >
      {/* 🖼️ Image with precise aspect ratio */}
      <div className="aspect-289/200 w-full relative">
        <Image
          src={image}
          alt={`${name}، ${specialty} در ${city}`}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
        />
      </div>

      {/* 📝 Info section */}
      <div className={clsx('flex flex-col gap-y-2 p-3 sm:p-4')}>
        {/* ⭐ Name & Rating */}
        <div className={clsx('flex items-start justify-between gap-x-2')}>
          <h4
            className={clsx('font-medium text-sm sm:text-base', 'line-clamp-1')}
          >
            {name}
          </h4>
          <div className={clsx('flex items-center gap-x-1 shrink-0')}>
            <FaStar color="#FFB800" size={12} aria-hidden="true" />
            <span
              className={clsx(
                'text-[10px] sm:text-xs',
                'text-neutral-500 whitespace-nowrap'
              )}
            >
              {rating} ({reviewsCount.toLocaleString('fa-IR')} نظر)
            </span>
          </div>
        </div>

        {/* 📍 Specialty & City */}
        <div className={clsx('flex items-center justify-between gap-x-2')}>
          <span
            className={clsx(
              'text-xs sm:text-sm',
              'text-neutral-600 line-clamp-1'
            )}
          >
            {specialty}
          </span>
          <div className={clsx('flex items-center gap-x-1 shrink-0')}>
            <HugeiconsIcon
              icon={Location04Icon}
              size={14}
              color="#6D6D6D"
              aria-hidden="true"
            />
            <span
              className={clsx(
                'text-[10px] sm:text-xs',
                'text-neutral-500 whitespace-nowrap'
              )}
            >
              {city}
            </span>
          </div>
        </div>

        {/* 📅 CTA Button */}
        <Link
          href={`/doctor/${id}`}
          className={clsx(
            'mt-3 sm:mt-4',
            'flex items-center justify-center',
            'text-primary-600 font-medium text-xs sm:text-sm',
            'border border-primary-500 rounded-lg',
            'h-9 sm:h-10',
            'transition-colors',
            'hover:text-white hover:bg-primary-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          )}
        >
          دریافت نوبت
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
