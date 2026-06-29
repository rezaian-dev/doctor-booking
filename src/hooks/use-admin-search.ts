'use client';

/**
 * 🔍 useAdminSearch — Shared hook for admin filter components
 * Eliminates duplicated debounce + URL param logic in users/doctors/articles filters
 *
 * 🐛 Bug fixed: previously the useEffect syncing inputValue from initialValue would
 *    reset the input mid-keystroke. When the debounce fires router.push() → the server
 *    re-renders → initialValue changes → useEffect fires → characters the user just typed
 *    get wiped. Fix: an isTyping ref suppresses the sync while a debounce is in-flight.
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
  // 🔒 True while a debounce is pending — blocks the initialValue sync so in-flight
  //    keystrokes are never overwritten by a concurrent server re-render.
  const isTyping = useRef(false);

  useEffect(() => {
    // ✋ Skip the reset if the user is actively typing; their local state is the truth.
    if (isTyping.current) return;
    setInputValue(initialValue);
  }, [initialValue]);

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

      // ⏱️ Mark as typing; clear the flag only after the debounce fires so the
      //    initialValue useEffect can't stomp on the user's input in the meantime.
      isTyping.current = true;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        isTyping.current = false;
        pushParams({ search: val });
      }, 400);
    },
    [pushParams],
  );

  const clearSearch = useCallback(() => {
    isTyping.current = false;
    setInputValue('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    pushParams({ search: '' });
  }, [pushParams]);

  return { inputValue, handleSearchChange, clearSearch, pushParams };
}
