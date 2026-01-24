'use client';

import DoctorCard from './DoctorCard';
import SwiperSection from './SwiperSection';

interface DoctorSectionProps {
  title: string;
}

// 📦 Doctor data type
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  reviewsCount: number;
  city: string;
  image: string;
}

/**
 * 🏆 DoctorSection – Refactored using shared SwiperSection
 * ✅ Clean & DRY | ✅ Type-safe | ✅ Maintainable
 */
const DoctorSection = ({ title }: DoctorSectionProps) => {
  // 📦 Static data – replace with API in production
  const doctors: readonly Doctor[] = [
    {
      id: 1,
      name: 'دکتر علی راد',
      specialty: 'متخصص ریه',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/4.png',
    },
    {
      id: 2,
      name: 'دکتر علی وارسته',
      specialty: 'متخصص قلب و عروق',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/1.png',
    },
    {
      id: 3,
      name: 'دکتر زهرا وارسته',
      specialty: 'متخصص قلب و عروق',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/2.png',
    },
    {
      id: 4,
      name: 'دکتر بهنوش حسینی',
      specialty: 'جراح گوش حلق و بینی',
      rating: '۳.۵',
      reviewsCount: 105,
      city: 'تهران',
      image: '/images/3.png',
    },
  ] as const;

  return (
    <SwiperSection
      title={title}
      viewAllHref="/doctors"
      items={doctors}
      renderItem={doctor => <DoctorCard {...doctor} />}
      getItemKey={doctor => doctor.id}

    />
  );
};

export default DoctorSection;
