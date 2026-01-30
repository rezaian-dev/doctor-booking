import { FC } from 'react';
import Header from '@/components/layout/header';
import PageTitle from '@/components/shared/page-title';
import BookingAlert from '@/components/features/booking/booking-alert';
import ProfileCard from '@/components/shared/profile-card';
import PaymentNotice from '@/components/features/booking/payment-notice';
import PaymentSummary from '@/components/features/booking/payment-summary';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';

const page: FC = () => {
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
            <BookingAlert />
            <ProfileCard mode={'payment'} />
            <PaymentNotice />
          </div>

          {/* 👥 Select patient (self or other) */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <PaymentSummary />
          </div>
        </div>
      </div>
      <Footer />
      <FooterMobile />
    </>
  );
};

export default page;
