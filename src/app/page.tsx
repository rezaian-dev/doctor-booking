import React from 'react';
import Header from '@/components/layouts/Header';
import Hero from '@/components/templates/home/Hero';
import InfoCards from '@/components/templates/home/InfoCards';
import SearchHero from '@/components/templates/home/SearchHero';
import SpecialtyGrid from '@/components/templates/home/SpecialtyGrid';
import PopularDocs from '@/components/templates/home/PopularDocs';
import HealthCTA from '@/components/templates/home/HealthCTA';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero/>
      <InfoCards/>
      <SearchHero/>
      <SpecialtyGrid/>
      <PopularDocs/>
      <HealthCTA/>
    </>
  );
};

export default LandingPage;
