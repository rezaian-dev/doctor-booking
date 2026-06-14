// 🧠 Client Component — renders the Swiper carousel or an empty state.
// ✨ Must be 'use client': it passes render fns to SwiperSection (Server Components can't). 🚫
'use client';

import DoctorCard from '@/components/shared/doctor-card';
import SwiperSection from '@/components/shared/swiper-section';
import { SectionEmptyState } from '@/components/shared/section-empty-state';
import { SectionHeader } from '@/components/shared/section-header';

// 🏥 Plain serializable doctor shape — safe to pass from Server → Client
interface Doctor {
  _id:              string;
  name:             string;
  specialty:        string;
  city:             string;
  photo:            string;
  hasOnlineVisit:   boolean;
  hasInPersonVisit: boolean;
  isAvailable:      boolean;
  reviewCount:      number;
  avgRating:        number;
}

interface Props {
  title:        string;
  doctors:      Doctor[];
  isLoggedIn?:  boolean;
  viewAllHref?: string; // 🔗 deep-link target for "view all" (carries the matching /doctors sort)
  autoplay?:    boolean | number; // ▶️ auto-advance the carousel
  containerClassName?: string;
}

export default function DoctorSection({
  title,
  doctors,
  isLoggedIn,
  viewAllHref = '/doctors',
  autoplay = false,
  containerClassName = 'container px-4 md:px-8 mt-[30px] md:mt-[94px]',
}: Props) {
  // 🪄 Empty state — same container & header rhythm as the carousel
  if (doctors.length === 0) {
    return (
      <section className={containerClassName}>
        <SectionHeader title={title} viewAllHref={viewAllHref} className="mb-5" />
        <SectionEmptyState variant="doctors" />
      </section>
    );
  }

  return (
    <SwiperSection
      title={title}
      viewAllHref={viewAllHref}
      items={doctors}
      autoplay={autoplay}
      containerClassName={containerClassName}
      renderItem={(doc: Doctor, index?: number) => (
        <DoctorCard {...doc} index={index ?? 0} {...(isLoggedIn !== undefined && { isLoggedIn })} />
      )}
      getItemKey={(doc: Doctor) => doc._id}
    />
  );
}
