import React from 'react';
import Header from '@/components/layouts/Header';
import PageTitle from '@/components/PageTitle';
import Profile from '@/components/templates/booking/Profile';
import PatientSelector from '@/components/templates/booking/PatientSelector';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

/**
 * 📄 Booking Confirmation Page
 * This page guides the user through selecting a patient for appointment.
 * It follows a clean, semantic, and accessible UI structure.
 */
const BookingConfirmPage: React.FC = () => {
  return (
    <>
      {/* 🚀 Render header component */}
      <Header />

      {/* 🏷️ Set page title for SEO and accessibility */}
      <div className="container px-4 md:px-8">
        <div className="max-w-[805px] mx-auto">
          <PageTitle title="انتخاب مراجع" hasPadding={false} />
        </div>
      </div>

      {/* 📦 Main content container with responsive padding */}
      <div className="container px-4 mt-6 mb-6 md:my-6 md:px-8">
        {/* 🎯 Centered content with max width and vertical spacing */}
        <div className="max-w-[805px] mx-auto space-y-6">
          {/* 👨‍⚕️ Display doctor profile without bio section */}
          <Profile showBio={false} />

          {/* 👥 Select patient (self or other) */}
          <PatientSelector />
        </div>
      </div>

      {/* 🖥️ Render desktop footer */}
      <Footer />

      {/* 📱 Render mobile-specific footer */}
      <FooterMobile />
    </>
  );
};

export default BookingConfirmPage;
