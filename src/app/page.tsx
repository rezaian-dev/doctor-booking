import React from 'react';
import Header from '../components/layouts/Header';
import Hero from '../components/templates/home/Hero';
import InfoCards from '../components/templates/home/InfoCards';

const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero/>
      <InfoCards/>
    </>
  );
};

export default LandingPage;
