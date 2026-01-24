import { Toaster } from "sonner";
import Header from "@/components/layouts/Header";
import ProfileCard from "@/components/templates/profile/ProfileCard";
import { UserProfile } from "@/types/profileTypes";
import Footer from "@/components/layouts/Footer";
import FooterMobile from "@/components/layouts/FooterMobile";
import { FC } from "react";

const Page: FC = () => {
  const initialData: UserProfile = {
    firstName: "فاطمه",
    lastName: "طیبی",
    nationalCode: "0123456789",
    birthDate: "۱۳۶۷/۱۲/۲۲",
    gender: "خانم",
    city: "تهران",
    email: "fateme.tayebi@example.com",
    mobile: "۰۹۱۲۷۸۹۳۹۸۷",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fateme",
  };

  return (
    <>
      <Header />
      <Toaster position="top-center" richColors dir="rtl" />
      <main className="min-h-screen bg-linear-to-br pt-11 bg-danger-50 py-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              پروفایل کاربری
            </h1>
            <span className="text-sm text-gray-600">
              مشاهده و ویرایش اطلاعات شخصی
            </span>
          </div>
          <ProfileCard initialProfile={initialData} />
        </div>
      </main>
      <Footer />
      <FooterMobile />
    </>
  );
}

export default Page;
