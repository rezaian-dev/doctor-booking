import { FC } from 'react';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import ProfileContent from '@/components/features/profile/profile-content';
import { Toaster } from '@/components/ui/sonner';
import { getAuthUser } from '@/lib/auth/auth-session';

// 🔐 Protected profile page
const ProfilePage: FC = async () => {
  const user = await getAuthUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <>
      <Header />
      <Toaster position="top-center" richColors dir="rtl" />

      <main className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 pt-20 pb-8" dir="rtl">
        <div className="container mx-auto px-4 max-w-5xl space-y-6">
          <header className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">پروفایل کاربری</h1>
            <p className="text-sm text-gray-600">مشاهده و ویرایش اطلاعات شخصی</p>
          </header>

          {/* 📡 Client component with SWR */}
          <ProfileContent />
        </div>
      </main>

      <Footer />
      <FooterMobile />
    </>
  );
};

export default ProfilePage;
