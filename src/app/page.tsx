import React from 'react';
import Header from '@/components/layouts/Header';
import Hero from '@/components/templates/home/Hero';
import InfoCards from '@/components/templates/home/InfoCards';
import SearchHero from '@/components/templates/home/SearchHero';
import SpecialtyGrid from '@/components/templates/home/SpecialtyGrid';
import HealthCTA from '@/components/templates/home/HealthCTA';
import DoctorSection from '@/components/templates/home/DoctorSection';
import UserTestimonials from '@/components/templates/home/UserTestimonials';
import HomeFaqAccordion from '@/components/templates/home/HomeFaqAccordion';
import MedicalArticles from '@/components/templates/home/MedicalArticles';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <InfoCards />
      <SearchHero />
      <SpecialtyGrid />
      <DoctorSection title="محبوب‌ترین پزشکان (بر اساس تعداد نوبت‌های رزرو شده)" />
      <HealthCTA />
      <DoctorSection title="جدیدترین پزشک‌ها" />
      <UserTestimonials />
      <HomeFaqAccordion />
      <MedicalArticles />
      <Footer />
      <FooterMobile/>
    </>
  );
};

export default LandingPage;
