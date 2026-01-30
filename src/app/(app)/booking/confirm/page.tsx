import { FC } from 'react';
import Header from '@/components/layout/header';
import PageTitle from '@/components/shared/page-title';
import ProfileCard from '@/components/shared/profile-card';
import PatientSelector from '@/components/features/booking/patient-selector';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';

/**
 * 📄 Booking Confirmation Page
 * This page guides the user through selecting a patient for appointment.
 * It follows a clean, semantic, and accessible UI structure.
 */
const Page: FC = () => {
  return (
    <>
      {/* 🚀 Render header component */}
      <Header />

      {/* 🏷️ Set page title for SEO and accessibility */}
      <div className="container px-4 md:px-8">
        <div className="max-w-201.25 mx-auto">
          <PageTitle title="انتخاب مراجع" hasPadding={false} />
        </div>
      </div>

      {/* 📦 Main content container with responsive padding */}
      <div className="container px-4 mt-6 mb-6 md:my-6 md:px-8">
        {/* 🎯 Centered content with max width and vertical spacing */}
        <div className="max-w-201.25 mx-auto space-y-6">
          {/* 👨‍⚕️ Display doctor profile without bio section */}
          <ProfileCard mode="confirm" />

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

export default Page;
