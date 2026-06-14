import { buildStars } from '@/lib/utils/array-utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Star } from 'lucide-react';

interface UserTestimonialCardProps {
  userName:             string;
  userImage:            string;
  rating:               number;
  date:                 string;
  comment:              string;
  doctorName?:          string;
  doctorLink?:          string;
  showDoctorReference?: boolean;
  className?:           string;
}

// ✅ Helper: treat empty string OR missing value as "no real avatar"
function resolveAvatar(src: string | undefined | null): string {
  return src && src.trim() !== '' ? src : '/images/review-user-2.png';
}

const UserTestimonialCard: React.FC<UserTestimonialCardProps> = ({
  userName,
  userImage,
  rating,
  date,
  comment,
  doctorName,
  doctorLink,
  showDoctorReference = true,
  className = '',
}) => {
  const shouldShowDoctorReference = showDoctorReference && doctorName && doctorLink;
  const avatarSrc = resolveAvatar(userImage);

  return (
    <li className={`bg-white flex flex-col gap-y-4 ${className}`}>

      {/* 👤 User info & rating */}
      <div className="flex justify-between items-start gap-x-2">
        <div className="flex gap-x-2 min-w-0">
          <div className="relative w-7 h-7 shrink-0 rounded-full overflow-hidden">
            <Image
              src={avatarSrc}
              fill
              alt={userName}
              className="object-cover"
              sizes="28px"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <span className="font-medium text-sm sm:text-base text-neutral-900 inline-block truncate max-w-full">
              {userName}
            </span>
            <div className="flex flex-row-reverse mt-1 justify-end">
              {buildStars(rating).map((filled, i) => (
                <Star key={i} size={12} aria-hidden className={filled ? 'text-amber-400 fill-amber-400' : 'text-neutral-600 fill-neutral-300'} />
              ))}
            </div>
          </div>
        </div>
        {/* 🗓️ Date — never wraps; Latin/Persian digits stay on one tidy line */}
        <time className="shrink-0 whitespace-nowrap text-neutral-600 text-xs py-1 tabular-nums">({date})</time>
      </div>

      {/* 💬 Comment */}
      <p className="text-neutral-900 text-[13px] line-clamp-3 md:line-clamp-2 min-h-14.5 md:min-h-10">
        {comment}
      </p>

      {/* 🩺 Doctor reference */}
      {shouldShowDoctorReference && (
        <div className="flex items-center justify-between mt-auto">
          <span className="text-neutral-600 text-xs">درباره {doctorName}</span>
          <Link
            href={doctorLink!}
            className="text-primary-500 font-medium text-xs hover:underline focus:outline-none"
          >
            مشاهده دکتر
          </Link>
        </div>
      )}
    </li>
  );
};

export default UserTestimonialCard;
