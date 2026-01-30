import { FC } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import FooterMobile from '@/components/layout/footer-mobile';
import ProfileCard from '@/components/features/profile/profile-card';
import { Toaster } from '@/components/ui/sonner';
import { UserProfile } from '@/types/profile-types';

// 🔐 Fetch user profile
async function getProfile(): Promise<UserProfile> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    redirect('/auth/login');
  }

  try {
    const res = await fetch('http://localhost:3000/api/profile', {
      headers: { Cookie: `accessToken=${accessToken}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      redirect('/auth/login');
    }

    const { user } = await res.json();

    return {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      email: user.email || '',
      nationalCode: user.nationalCode || '',
      birthDate: user.birthDate || '',
      gender: user.gender || '',
      city: user.city || '',
      imageUrl: user.avatar || '',
    };
  } catch {
    redirect('/auth/login');
  }
}

const ProfilePage: FC = async () => {
  const profile = await getProfile();

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

          <ProfileCard initialProfile={profile} />
        </div>
      </main>

      <Footer />
      <FooterMobile />
    </>
  );
};

export default ProfilePage;
