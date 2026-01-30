import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdOutlineStar } from 'react-icons/md';

interface UserTestimonialCardProps {
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
  doctorName?: string;   // Optional: for doctor reference
  doctorLink?: string;   // Optional: link to doctor profile
  showDoctorReference?: boolean; // Controls visibility of doctor section
  className?: string;    // External class overrides (flexible styling)
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
  const shouldShowDoctorReference =
    showDoctorReference && doctorName && doctorLink;

      // 🌟 Generate star rating array based on rating value
  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  };

  return (
    <li className={`bg-white flex flex-col gap-y-4 ${className}`}>
      {/* 👤 User info & rating */}
      <div className="flex justify-between">
        <div className="flex gap-x-2">
          <Image
            src={userImage}
            width={28}
            height={28}
            alt={userName}
            className="w-7! h-7! rounded-full"
            loading="lazy"
          />
          <div>
            <span className="font-medium text-sm sm:text-base text-neutral-900 inline-block">
              {userName}
            </span>
            <div className="flex flex-row-reverse mt-1 justify-end">
              {/* 🌟 Star rating — rendered from right to left */}
              {generateStars(4).map((filled, index) => (
                <MdOutlineStar
                  key={index}
                  size={12}
                  color={filled ? '#FFB800' : '#D3D5E4'}
                />
              ))}
            </div>
          </div>
        </div>
        {/* 📅 Date badge — aligned to right */}
        <time className="text-neutral-400 text-xs py-1">({date})</time>
      </div>

      {/* 💬 Testimonial text — truncated with line-clamp for clean UX */}
      <p className="text-neutral-900 text-[13px] line-clamp-3 md:line-clamp-2 min-h-14.5 md:min-h-10">
        {comment}
      </p>

      {/* 🩺 Doctor reference — conditionally rendered */}
      {shouldShowDoctorReference && (
        <div className="flex items-center justify-between mt-auto">
          <span className="text-neutral-400 text-xs">
            درباره {doctorName}
          </span>
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
