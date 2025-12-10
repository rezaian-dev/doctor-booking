import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';
import Header from '@/components/layouts/Header';
import FaqAccordion from '@/components/FaqAccordion';
import React from 'react';

// 📄 FAQ Page Component
// Displays a full-width FAQ section with header, accordion, and footers.
const page: React.FC = () => {
  return (
    <>
      {/* 🧭 Top-level layout header */}
      <Header />

      {/* 🗨️ Page heading with responsive spacing and typography */}
      <div className="container px-4 md:px-8">
        <h2 className="text-neutral-975 font-medium text-xl my-7 sm:text-2xl sm:my-10 md:my-8">
          سوالات متداول
        </h2>
      </div>

      {/* 🧾 Full-mode FAQ accordion */}
      <FaqAccordion mode="full" />

      {/* 📦 Footer section – includes both desktop and mobile variants */}
      <div className="mt-6 md:mt-8">
        <Footer />
        <FooterMobile />
      </div>
    </>
  );
};

export default page;