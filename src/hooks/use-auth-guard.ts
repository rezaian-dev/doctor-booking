'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * useAuthGuard — gate a protected action behind a client-side auth check.
 * Returns `guard(onAuthorized)`: runs the callback if logged in, else shows a
 * Sonner toast. Pass `isLoggedIn` from the server to skip the network probe;
 * otherwise auth is checked once via /api/user/me and cached for the mount.
 */
export function useAuthGuard(isLoggedIn?: boolean) {
  const router = useRouter();
  // 🗃️ Cache auth so /api/user/me is hit at most once per mount
  const authChecked = useRef<boolean | null>(isLoggedIn ?? null);
  // 🔁 Auth may arrive after mount (resolved via /api/auth/me), so keep the ref fresh when a
  //    concrete boolean is given; falls back to a lazy /api/user/me probe while undefined. 🧠
  useEffect(() => {
    if (typeof isLoggedIn === 'boolean') authChecked.current = isLoggedIn;
  }, [isLoggedIn]);

  const guard = useCallback(
    async (onAuthorized: () => void | Promise<void>) => {
      // 🔎 Resolve auth lazily only when the server didn't provide it
      if (authChecked.current === null) {
        try {
          const res = await fetch('/api/user/me', { credentials: 'include' });
          const data = await res.json();
          authChecked.current = !!data?.user;
        } catch {
          authChecked.current = false;
        }
      }

      if (authChecked.current) {
        onAuthorized();
        return;
      }

      // 🔒 Not authenticated → a single prompt. toast is lazily imported here so sonner never
      //    ships in the initial bundle of pages that merely mount this hook. 🚀
      const { toast } = await import('sonner');
      toast.error('ابتدا وارد شوید', {
        description: 'برای ادامه باید وارد حساب کاربری خود شوید.',
        action: { label: 'ورود', onClick: () => router.push('/auth/login') },
        duration: 4000,
      });
    },
    [router]
  );

  return { guard };
}
