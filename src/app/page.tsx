import React from 'react';
import Header from '@/components/layouts/Header';
import Hero from '@/components/templates/home/Hero';
import InfoCards from '@/components/templates/home/InfoCards';
import SearchHero from '@/components/templates/home/SearchHero';
import SpecialtyGrid from '@/components/templates/home/SpecialtyGrid';
import HealthCTA from '@/components/templates/home/HealthCTA';
import DoctorSection from '@/components/templates/home/DoctorSection';

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
    </>
  );
};

export default LandingPage;
