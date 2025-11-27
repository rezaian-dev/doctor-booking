import React from 'react';
import Header from '@/components/layouts/Header';
import PageTitle from '@/components/PageTitle';
import BookingAlert from '@/components/templates/booking/BookingAlert';
import DoctorProfile from '@/components/DoctorProfile';
import PaymentNotice from '@/components/templates/booking/PaymentNotice';
import PaymentSummary from '@/components/templates/booking/PaymentSummary';
import Footer from '@/components/layouts/Footer';
import FooterMobile from '@/components/layouts/FooterMobile';

const page: React.FC = () => {
  return (
    <>
      <Header />
      <PageTitle title="پرداخت و ثبت رزرو" hasPadding={true} />

      {/* 📦 Main content container with responsive padding */}
      <div className="container px-4 mt-6 mb-6 md:my-6 md:px-8">
        {/* 🎯 Centered content with max width and vertical spacing */}
        <div className=" grid grid-cols-12 gap-x-5">
          {/* 👨‍⚕️ Display doctor profile without bio section */}
          <div className="space-y-6 col-span-12 lg:col-span-7 xl:col-span-8">
            <BookingAlert/>
            <DoctorProfile  mode={"payment"} />
            <PaymentNotice/>
          </div>

          {/* 👥 Select patient (self or other) */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <PaymentSummary/>
          </div>
        </div>
      </div>
      <Footer/>
      <FooterMobile/>
    </>
  );
};

export default page;
