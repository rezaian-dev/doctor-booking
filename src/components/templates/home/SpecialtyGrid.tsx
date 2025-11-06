import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import React from 'react';
import SpecialtyCard from './SpecialtyCard';

/**
 * 🩺 Static list of medical specialties.
 * 🔒 Immutable & type-safe using `as const` (great for maintainability!).
 */
const healthServices = [
  {
    id: 1,
    image: '/images/heart.png',
    title: 'قلب و عروق',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 2,
    image: '/images/orthopedics.png',
    title: 'ارتوپد',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 3,
    image: '/images/brain.png',
    title: 'مغزواعصاب',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 4,
    image: '/images/pulmonology.png',
    title: 'دستگاه تنفسی',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 5,
    image: '/images/eye-test.png',
    title: 'چشم پزشکی',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 6,
    image: '/images/pediatric.png',
    title: 'اطفال',
    subtitle: '+۱۴۵ پزشک',
  },
  {
    id: 7,
    image: '/images/heart.png',
    title: 'گوش حلق و بینی',
    subtitle: '+۱۴۵ پزشک',
  },
] as const;

/**
 * 🏥 Responsive Medical Specialties Grid
 * ✨ Fully responsive, no carousel — consistent UX on all devices!
 *
 * 📱 Breakpoints:
 *   • xs (mobile): 2 columns
 *   • sm (small tablet): 3 columns
 *   • md (tablet): 5 columns
 *   • xl (desktop): 7 columns
 *
 * 🧩 Reusable & scalable — each card is a <SpecialtyCard /> component.
 */
const SpecialtyGrid: React.FC = () => {
  return (
    <section className="container px-4 md:px-8 mt-3.5 md:mt-[94px]">
      {/* 🎯 Section header: title + "View All" CTA */}
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-xl md:text-2xl">لیست تخصص ها</h2>
        <div className="flex items-center gap-x-1.5">
          <span className="font-medium text-sm text-neutral-400">
            مشاهده همه
          </span>
          {/* 🔄 RTL-friendly arrow (note: color fixed to valid hex format!) */}
          <MdOutlineKeyboardArrowLeft size={20} color="#b3b3b3" />
        </div>
      </div>

      {/* 🧱 Responsive grid — auto-adjusts columns based on screen size */}
      <div className="grid xl:grid-cols-7 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 gap-4 gap-x-3.5 mt-[18px] auto-rows-fr">
        {healthServices.map(({ id, image, title, subtitle }) => (
          <SpecialtyCard
            key={id}
            image={image}
            title={title}
            subtitle={subtitle}
          />
        ))}
      </div>
    </section>
  );
};

export default SpecialtyGrid;
