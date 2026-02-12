import { FC } from 'react';

import FaqAccordion from '@/components/shared/faq-accordion';
import Hero from '@/components/features/home/hero';
import InfoCards from '@/components/features/home/info-cards';
import SearchHero from '@/components/features/home/search-hero';
import SpecialtyGrid from '@/components/features/home/specialty-grid';
import DoctorSection from '@/components/shared/doctor-section';
import HealthCTA from '@/components/features/home/health-cta';
import UserTestimonials from '@/components/features/home/user-testimonials';
import MedicalArticles from '@/components/features/home/medical-articles';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import { Header } from '@/components/layout/header';

const Page: FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <InfoCards mode={'home'} />
      <SearchHero mode="main" />
      <SpecialtyGrid />
      <DoctorSection title="محبوب‌ترین پزشکان (بر اساس تعداد نوبت‌های رزرو شده)" />
      <HealthCTA />
      <DoctorSection title="جدیدترین پزشک‌ها" />
      <UserTestimonials />
      <FaqAccordion mode="preview" />
      <MedicalArticles />
      <Footer />
      <FooterMobile />
    </>
  );
};

export default Page;
