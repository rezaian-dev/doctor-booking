import React from 'react';
import { CommentAdd01Icon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { HugeiconsIcon } from '@hugeicons/react';
import { FaStar } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import UserTestimonialCard from '@/components/features/home/user-testimonial-card';

const Reviews: React.FC = () => {
  // 📝 Mock data for demonstration
  const ratingData = {
    filledStars: 4,
    totalStars: 5,
    rating: 4,
    count: 105,
  } as const;

  const recommendationStat = {
    percentage: 90,
    label: 'مراجعان این پزشک را پیشنهاد داده‌اند',
  } as const;

  const submitReviewButton = {
    text: 'ثبت نظر',
    iconColor: '#4179F0',
  } as const;

  const loadMoreButton = {
    text: 'نظرات بیشتر',
    iconColor: '#4179F0',
  } as const;

  // 🌟 Generate star rating array
  const generateStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  };

  return (
    <section className="my-10 px-5 pb-2 rounded-[12px] border border-neutral-100">
      {/* 🏷️ Section header */}
      <h4 className="text-lg font-medium mb-4 mt-2">نظرات کاربران</h4>

      {/* 📊 Rating & Stats Section */}
      <div className="flex items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-y-2 md:gap-y-0 md:gap-x-52">
          {/* ⭐ Star Rating + Count */}
          <div className="flex items-center gap-x-1.5">
            <div className="flex items-center text-alert flex-row-reverse">
              4
              {generateStars(ratingData.rating).map((filled, index) => (
                <FaStar
                  key={index}
                  color={filled ? '#FFB800' : '#D1D1D1'}
                  size={18}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-base text-neutral-500">
              ({ratingData.count} نظر)
            </span>
          </div>

          {/* 👍 Recommendation Stat */}
          <div className="flex items-center gap-x-1">
            <HugeiconsIcon icon={ThumbsUpIcon} color="#60C61D" size={24} />
            <span className="text-neutral-600 text-[10px] sm:text-[13px]">
              {recommendationStat.percentage}% {recommendationStat.label}
            </span>
          </div>
        </div>

        {/* 📝 Submit Review Button - Using Shadcn Button */}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 h-9 w-17.5 sm:w-26 text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-white transition-colors duration-200 group"
        >
          {submitReviewButton.text}
          <HugeiconsIcon
            icon={CommentAdd01Icon}
            size={16}
            color={submitReviewButton.iconColor}
            className="group-hover:text-white transition-colors duration-200"
          />
        </Button>
      </div>

      {/* 💬 Testimonials List */}
      <ul className="space-y-0">
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0"
        />
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0"
        />
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0"
        />
      </ul>

      {/* 🔄 Load More Button - Using Shadcn Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex mx-auto gap-x-1 h-9 max-w-33.5 text-primary-500 hover:text-primary-600 hover:bg-transparent"
      >
        {loadMoreButton.text}
        <IoIosArrowDown size={16} color={loadMoreButton.iconColor} />
      </Button>
    </section>
  );
};

export default Reviews;
