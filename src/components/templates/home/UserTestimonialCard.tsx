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
  doctorName: string;
  doctorLink: string;
}

const UserTestimonialCard = ({
  userName,
  userImage,
  rating,
  date,
  comment,
  doctorName,
  doctorLink,
}:UserTestimonialCardProps) => {
  return (
    <li className="rounded-xl border border-neutral-100 bg-white p-6 flex flex-col gap-y-4">
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
            <div className="flex flex-row-reverse mt-1 justify-end ">
              {[...Array(5)].map((_, i) => (
                <MdOutlineStar
                  key={i}
                  size={12}
                  color={i < rating ? '#FFB800' : '#D3D5E4'}
                />
              ))}
            </div>
          </div>
        </div>
        <time className="text-neutral-400 text-xs py-1">({date})</time>
      </div>

      {/* 💬 Testimonial text */}
      <p className="text-neutral-900 text-[13px] line-clamp-3 md:line-clamp-2 min-h-[58px] md:min-h-10">
        {comment}
      </p>

      {/* 🩺 Doctor reference */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-neutral-400 text-xs">
          درباره {doctorName}
        </span>
        <Link
          href={doctorLink}
          className="text-primary-500 font-medium text-xs hover:underline focus:outline-none"
        >
          مشاهده دکتر
        </Link>
      </div>
    </li>
  );
};

export default UserTestimonialCard;
