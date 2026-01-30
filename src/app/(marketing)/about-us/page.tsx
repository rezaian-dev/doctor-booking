import { FC } from 'react';
import Header from '@/components/layout/header';
import Intro from '@/components/features/about-us/intro';
import InfoCards from '@/components/features/home/info-cards';
import ContactSection from '@/components/features/about-us/contact-section';
import AppPreview from '@/components/features/about-us/app-preview';
import FeatureCards from '@/components/features/about-us/feature-cards';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';


const page: FC = () => {
  return (
    <>
      <Header />
      <Intro/>
      <InfoCards mode={'about'}/>
      <ContactSection/>
      <AppPreview/>
      <FeatureCards/>
      <Footer/>
      <FooterMobile/>
    </>
  );
};
export default page;
