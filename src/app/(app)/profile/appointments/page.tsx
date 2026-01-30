import { FC } from 'react';
import Header from '@/components/layout/header';
import ProfileCard from '@/components/shared/profile-card';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';

const page: FC = () => {
  return (
    <>
      {/* 📌 Top navigation bar */}
      <Header />

      {/* 🗓️ Appointment list section */}
      <section className="container px-4 md:px-8 mb-6 md:mb-8">
        <h1 className="text-neutral-975 font-medium text-2xl mt-8">
          لیست نوبت‌ها
        </h1>
        <div className="mt-6 md:mt-8 space-y-3">
          {/* 👩‍⚕️ Single doctor profile card in "profile" mode */}
          <ProfileCard mode="profile" />
        </div>
      </section>

      {/* 🧱 Footers for all devices */}
      <Footer />
      <FooterMobile />
    </>
  );
};

export default page;
