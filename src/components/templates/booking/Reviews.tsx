import { CommentAdd01Icon, ThumbsUpIcon } from '@hugeicons/core-free-icons';
import { IoIosArrowDown } from 'react-icons/io';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';
import { FaStar } from 'react-icons/fa6';
import UserTestimonialCard from '../home/UserTestimonialCard'; // ✅ Ensure correct path

const Reviews: React.FC = () => {
  // 📝 Mock data for demonstration — replace with actual props or state
  const ratingData = {
    filledStars: 4,
    totalStars: 5,
    rating: 4, // totalStars - filledStars
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
  // 🌟 Generate star rating array based on rating value
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
            <span className="text-neutral-600 text-[10px]  sm:text-[13px]">
              {recommendationStat.percentage}% {recommendationStat.label}
            </span>
          </div>
        </div>

        {/* 📝 Submit Review Button */}
        <button className="flex items-center cursor-pointer bg-white shrink-0 transition-colors duration-200 hover:bg-primary-500 hover:text-white h-9 w-[70px] sm:w-[104px] text-primary-500 font-medium text-xs justify-center rounded-[6px] border border-primary-500 group">
          {submitReviewButton.text}
          <HugeiconsIcon
            icon={CommentAdd01Icon}
            size={16}
            color={submitReviewButton.iconColor}
            className="group-hover:text-white transition-colors duration-200" // ✨ Icon color transition on hover
          />
        </button>
      </div>

      {/* 💬 Testimonials List */}
      <ul className="space-y-0">
        {' '}
        {/* 🔁 Use space-y-0 for consistent control with card's own spacing */}
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0" // ✅ Auto-hide border for last item
        />
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0" // ✅ Auto-hide border for last item
        />
        <UserTestimonialCard
          userName="علی رضایی"
          userImage="/images/user-2.png"
          rating={4}
          date="1401/03/15"
          comment="خدمات بسیار خوبی ارائه شد. ممنون از تیم پزشکی."
          showDoctorReference={false}
          className="border-t mt-2 p-4 last:border-b-0" // ✅ Auto-hide border for last item
        />
        {/* 📌 Add more UserTestimonialCard components here as needed */}
      </ul>

      {/* 🔄 Load More Button */}
      <button className="flex mx-auto cursor-pointer items-center grow gap-x-1 justify-center h-9 max-w-[134px]  text-primary-500 text-xs font-medium">
        {loadMoreButton.text}
        <IoIosArrowDown size={16} color={loadMoreButton.iconColor} />
      </button>
    </section>
  );
};

export default Reviews;
