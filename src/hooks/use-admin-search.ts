'use client';

/**
 * 🔍 useAdminSearch — Shared hook for admin filter components
 * Eliminates duplicated debounce + URL param logic in users/doctors/articles filters
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useCallback, useEffect, useRef, useState } from 'react';

export function useAdminSearch(initialValue: string) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(initialValue);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setInputValue(initialValue); }, [initialValue]);

  // 🧹 Cancel any pending debounce on unmount (avoids navigation after teardown)
  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v) params.set(k, v);
        else params.delete(k);
      });
      params.delete('page');
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, pathname],
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => pushParams({ search: val }), 400);
    },
    [pushParams],
  );

  const clearSearch = useCallback(() => {
    setInputValue('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    pushParams({ search: '' });
  }, [pushParams]);

  return { inputValue, handleSearchChange, clearSearch, pushParams };
}
