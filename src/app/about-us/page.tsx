import Header from '@/components/layouts/Header';
import Intro from '@/components/templates/about-us/Intro';
import InfoCards from '@/components/templates/home/InfoCards';
import { FC } from 'react';

const page: FC = () => {
  return (
    <>
      <Header />
      <Intro/>
      <InfoCards mode={'about'}/>
    </>
  );
};
export default page;
