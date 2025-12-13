import Header from '@/components/layouts/Header';
import AppPreview from '@/components/templates/about-us/AppPreview';
import ContactSection from '@/components/templates/about-us/ContactSection';
import Intro from '@/components/templates/about-us/Intro';
import InfoCards from '@/components/templates/home/InfoCards';
import { FC } from 'react';

const page: FC = () => {
  return (
    <>
      <Header />
      <Intro/>
      <InfoCards mode={'about'}/>
      <ContactSection/>
      <AppPreview/>
    </>
  );
};
export default page;
