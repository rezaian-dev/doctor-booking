import React from 'react';
import FeatureCard from './FeatureCard';

// 📌 Feature data for info cards (immutable)
const features = [
  {
    id: 1,
    icon: '/svgs/setting-04.svg',
    alt: 'مدیریت نوبت',
    title: 'مدیریت و تغییر نوبت‌ها به راحتی',
    description: "توانایی لغو، تغییر و مدیریت نوبت ها به راحتی",
  },
  {
    id: 2,
    icon: '/svgs/comment-01.svg',
    alt: 'نظرات کاربران',
    title: 'اطمینان از انتخاب مجرب‌ترین پزشکان',
    description: "بهترین پزشکان را با توجه به نظرات کاربران انتخاب کنید",
  },
  {
    id: 3,
    icon: '/svgs/clock-02.svg',
    alt: 'دسترسی ۲۴ ساعته',
    title: "دسترسی ۲۴ ساعته به پزشکان",
    description: "در هر زمانی میتوانید نوبت خود را رزرو کنید",
  },
] as const;

// 🧩 Responsive info cards section (1 → 2 → 3 columns)
const InfoCards: React.FC = () => {
  return (
    <section className="container px-4 md:px-8 mt-3.5 md:mt-6">
      {/* 📱 Responsive grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {features.map(({ id, icon, alt, title, description }) => (
          <FeatureCard
            key={id}
            icon={icon}
            title={title}
            description={description}
            alt={alt}
          />
        ))}
      </div>
    </section>
  );
};

export default InfoCards;
