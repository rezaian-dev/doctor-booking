import { FC } from "react";
import Header from "@/components/layout/header";
import DoctorFilters from "@/components/features/find-doctor/doctor-filters";
import DoctorResults from "@/components/features/find-doctor/doctor-results";
import Footer from "@/components/layout/footer";
import FooterMobile from "@/components/layout/footer-mobile";


/**
 * 🩺Doctors page — desktop sidebar + mobile-first results
 */
const Page: FC = () => {
  return (
    <>
      <Header />
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-12 my-5.75 gap-x-5">
          {/* Filters: hidden on mobile */}
          <div className="hidden md:block md:col-span-5 lg:col-span-4 xl:col-span-3">
            <DoctorFilters mode='doctors' />
          </div>
          {/* Results: full width on mobile, offset on xl */}
          <div className="col-span-12 md:col-span-7 xl:col-span-9 xl:mr-6.25">
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
