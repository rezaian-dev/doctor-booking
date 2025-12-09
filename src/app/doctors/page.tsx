import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';
import Header from '@/components/layouts/Header';
import DoctorFilters from '@/components/templates/find-doctor/DoctorFilters';
import DoctorResults from '@/components/templates/find-doctor/DoctorResults';
import React from 'react';

/**
 * 🩺Doctors page — desktop sidebar + mobile-first results
 */
const Page: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-12 my-[23px] gap-x-5">
          {/* Filters: hidden on mobile */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 xl:col-span-3">
            <DoctorFilters mode='doctors' />
          </div>
          {/* Results: full width on mobile, offset on xl */}
          <div className="col-span-12 md:col-span-7 xl:col-span-9 xl:mr-[25px]">
            <DoctorResults />
          </div>
        </div>
      </div>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default Page;
