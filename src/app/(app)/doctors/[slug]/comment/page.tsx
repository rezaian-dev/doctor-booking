'use client';

import { FC } from 'react';
import { ReviewFormData } from '@/types/comment.types';
import { DoctorData } from '@/types/doctor-profile-types';
import Header from '@/components/layout/header';
import DoctorReview from '@/components/features/comment/doctor-review';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';

// 🎯 Mock doctor data - replace when API is ready
const mockDoctorData: DoctorData = {
  name: 'دکتر محمدرضا احمدی',
  specialty: 'متخصص قلب و عروق',
  image:
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  rating: 4.8,
  reviewsCount: 127,
  medicalCode: '۱۲۳۴۵۶',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۳',
  nextAvailableSlot: 'فردا - ساعت ۱۴:۳۰',
  bio: 'دکتر احمدی با بیش از ۱۵ سال سابقه در زمینه قلب و عروق، فارغ‌التحصیل دانشگاه تهران و دارای بورد تخصصی از اروپا می‌باشند. ایشان در زمینه آنژیوگرافی و آنژیوپلاستی متخصص هستند.',
};

// 🔄 Handle review submission - replace with actual API call
const handleSubmitReview = async (data: ReviewFormData): Promise<void> => {
  console.log('📤 Review Data:', data);
  // TODO: Add your API call here
  await new Promise(resolve => setTimeout(resolve, 1500));
};

const page: FC = () => {
  return (
    <>
      <Header />
      <DoctorReview
        doctorData={mockDoctorData}
        onSubmitReview={handleSubmitReview}
      />
      <Footer />
      <FooterMobile />
    </>
  );
};

export default page;
