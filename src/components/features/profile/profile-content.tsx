'use client';

import { FC } from 'react';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import ProfileCard from './profile-card';
import { UserProfile } from '@/types/profile-types';
import { useAuth } from '@/lib/providers/auth-provider'; // 🔥 Add this
import { useRouter } from 'next/navigation'; // 🔥 Add this
import { useEffect } from 'react'; // 🔥 Add this

// 🌐 API fetcher with type transformation
const fetcher = async (url: string): Promise<UserProfile> => {
  const res = await fetch(url, { credentials: 'include' });

  // 🚨 Handle 401 gracefully
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) throw new Error('Failed to fetch profile');

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
};

// 💀 Profile skeleton loader
function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      {/* 🎴 Main card skeleton */}
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm md:p-8">
        {/* 📝 Header with edit button */}
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>

        {/* 👤 Avatar section */}
        <div className="mb-10 flex justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        {/* 📋 Form fields grid */}
        <div className="space-y-6">
          {/* Row 1: First Name & Last Name */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Row 2: National Code & Phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Row 3: City & Email */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>

          {/* Row 4: Birth Date & Gender */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ❌ Error state component
function ProfileError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-100 items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900">
          خطا در بارگذاری اطلاعات
        </h3>
        <p className="mb-6 text-sm text-neutral-600">
          لطفاً دوباره تلاش کنید یا صفحه را رفرش نمایید
        </p>
        <button
          onClick={onRetry}
          className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}

// 📄 Profile content with real-time data
const ProfileContent: FC = () => {
  const { isAuthenticated } = useAuth(); // 🔥 Check auth status
  const router = useRouter();

  const { data: profile, error, isLoading, mutate } = useSWR<UserProfile>(
    '/api/profile',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
    }
  );

  // 🔐 Redirect to login if unauthorized
  useEffect(() => {
    if (error?.message === 'Unauthorized' && !isAuthenticated) {
      router.push('/login');
    }
  }, [error, isAuthenticated, router]);

  // 🔄 Show loading while redirecting or checking auth
  if (isLoading || (error?.message === 'Unauthorized' && !isAuthenticated)) {
    return <ProfileSkeleton />;
  }

  // ❌ Show error only for non-auth errors
  if (error && error.message !== 'Unauthorized') {
    return <ProfileError onRetry={() => mutate()} />;
  }

  // ✅ Show profile when data is available
  if (!profile) return <ProfileSkeleton />;

  return <ProfileCard initialProfile={profile} />;
};

export default ProfileContent;
