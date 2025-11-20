import React from 'react';
import Header from '@/components/layouts/Header';
import PageTitle from '@/components/PageTitle';
import DoctorOverview from '@/components/templates/booking/DoctorOverview';
import Reviews from '@/components/templates/booking/Reviews';
import BookingCalendar from '@/components/templates/booking/BookingCalendar';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

/**
 * Booking Page Component 📅
 * Main page for doctor booking flow with responsive layout
 * Organizes components in a grid system for optimal user experience
 */
const page: React.FC = () => {
  return (
    <>
      {/* Page header section 🏷️ */}
      <Header />
      {/* Dynamic page title display 📝 */}
      <PageTitle />

      {/* Main content container with responsive padding 📐 */}
      <div className="container px-4 md:px-8 mt-8">
        <div className="grid grid-cols-12 gap-x-5">
          {/* Doctor overview section - takes 7/12 cols on large screens */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <DoctorOverview />
          </div>

          {/* Booking calendar section - takes 5/12 cols on large screens */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <BookingCalendar />
          </div>

          {/* Reviews section - reorders on small screens */}
          <div className="col-span-12 xl:col-span-8 lg:order-1 order-2">
            <Reviews />
          </div>
        </div>
      </div>

      {/* Desktop footer 🖥️ */}
      <Footer />
      {/* Mobile footer 📱 */}
      <FooterMobile />
    </>
  );
};

export default page;
