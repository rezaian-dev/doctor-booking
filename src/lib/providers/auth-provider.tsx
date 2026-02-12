'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useOptimistic,
  useTransition,
  useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate as globalMutate } from 'swr'; // 🔥 Import global mutate
import { User } from '@/types/user.types';

// 🎯 Auth context type definition
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  mutate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 🌐 API fetcher with credentials
const fetcher = async (url: string): Promise<User | null> => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return null;
  return (await res.json()).user;
};

/**
 * ✨ Zero-flicker auth provider with SSR support
 * 🔐 Handles user authentication state globally
 * ⚡ Optimistic UI updates for instant feedback
 */
export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 📡 SWR with SSR fallback - prevents initial refetch
  const {
    data: user,
    mutate,
    isLoading,
  } = useSWR<User | null>('/api/user/me', fetcher, {
    fallbackData: initialUser,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  // ⚡ Optimistic UI updates for instant response
  const [optimisticUser, setOptimisticUser] = useOptimistic(
    user ?? null,
    (_, newUser: User | null) => newUser
  );

  // 🔐 Memoized authentication status
  const isAuthenticated = useMemo(
    () => optimisticUser !== null,
    [optimisticUser]
  );

  // 🚪 Logout handler with complete cache invalidation
  const logout = async (): Promise<void> => {
    startTransition(() => setOptimisticUser(null));

    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });

      // 🧹 Clear ALL SWR cache (including /api/profile)
      globalMutate(() => true, undefined, { revalidate: false });

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('❌ Logout failed:', error);
      await mutate(); // 🔄 Rollback on error
    }
  };

  // ✏️ Optimistic user update (for profile edits, etc.)
  const updateUser = (updatedData: Partial<User>) => {
    if (!optimisticUser) return;

    const newUser = { ...optimisticUser, ...updatedData };
    startTransition(() => setOptimisticUser(newUser));
    mutate(newUser, { revalidate: false });
  };

  // 🔄 Manual revalidation wrapper
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

/**
 * 🪝 Auth hook with validation
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('❌ useAuth must be used within AuthProvider');
  }
  return context;
}
