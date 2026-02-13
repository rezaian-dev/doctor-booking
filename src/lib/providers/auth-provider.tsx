'use client';

import { createContext, useContext, ReactNode, useOptimistic, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate as globalMutate } from 'swr';
import { User } from '@/types/patient';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  mutate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 🌐 Fetch user with credentials
const fetcher = async (url: string): Promise<User | null> => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  return (await res.json()).user;
};

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 📡 SWR with SSR fallback
  const { data: user, mutate, isLoading } = useSWR<User | null>('/api/user/me', fetcher, {
    fallbackData: initialUser,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  // ⚡ Optimistic updates for instant UI
  const [optimisticUser, setOptimisticUser] = useOptimistic(user ?? null, (_, newUser: User | null) => newUser);

  const isAuthenticated = useMemo(() => optimisticUser !== null, [optimisticUser]);

  // 🚪 Logout and clear cache
  const logout = async (): Promise<void> => {
    startTransition(() => setOptimisticUser(null));

    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

      // 🧹 Clear all SWR cache
      globalMutate(() => true, undefined, { revalidate: false });

      router.push('/');
      router.refresh();
    } catch (error) {
      await mutate();
    }
  };

  // ✏️ Update user optimistically
  const updateUser = (updatedData: Partial<User>) => {
    if (!optimisticUser) return;

    const newUser = { ...optimisticUser, ...updatedData };
    startTransition(() => setOptimisticUser(newUser));
    mutate(newUser, { revalidate: false });
  };

  const handleMutate = async (): Promise<void> => {
    await mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: optimisticUser,
        isAuthenticated,
        isLoading: isLoading || isPending,
        logout,
        updateUser,
        mutate: handleMutate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be within AuthProvider');
  }
  return context;
}
