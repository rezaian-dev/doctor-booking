'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import ProfileCard from './profile-card';
import { UserProfile } from '@/types/patient';
import ProfileSkeleton from '@/components/features/profile/profile-skeleton';
import ProfileError from '@/components/features/profile/profile-error';

// 🌐 Fetch and transform profile data
const fetcher = async (url: string): Promise<UserProfile> => {
  const res = await fetch(url, { credentials: 'include' });

  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to fetch');

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

// 📄 Main profile component
export default function ProfileContent() {
  const router = useRouter();

  const { data: profile, error, isLoading, mutate } = useSWR<UserProfile>('/api/profile', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: false,
    dedupingInterval: 5000,
  });

  // 🔐 Redirect on unauthorized — canonical auth route (matches the rest of the app)
  useEffect(() => {
    if (error?.message === 'Unauthorized') {
      router.push('/auth/login');
    }
  }, [error, router]);

  // 🔄 Show loading skeleton
  if (isLoading) return <ProfileSkeleton />;

  // ❌ Show error for non-auth issues
  if (error && error.message !== 'Unauthorized') {
    return <ProfileError onRetry={() => mutate()} />;
  }

  // ✅ Render profile card
  if (!profile) return <ProfileSkeleton />;

  return <ProfileCard initialProfile={profile} />;
}
