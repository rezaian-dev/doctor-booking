import React from 'react';
import Header from '@/components/layouts/Header';
import Hero from '@/components/templates/home/Hero';
import InfoCards from '@/components/templates/home/InfoCards';
import SearchHero from '@/components/templates/home/SearchHero';
import SpecialtyGrid from '@/components/templates/home/SpecialtyGrid';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero/>
      <InfoCards/>
      <SearchHero/>
      <SpecialtyGrid/>
    </>
  );
};

export default LandingPage;
