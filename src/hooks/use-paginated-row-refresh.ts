'use client';

/**
 * 🔁 usePaginatedRowRefresh — keeps URL pagination honest after a row leaves a list.
 *
 * Pass the number of rows currently rendered on this page. The returned callback,
 * run after a successful mutation, steps back one page when the *last* row of a
 * non-first page is gone (so you never land on an empty page) — otherwise it just
 * refreshes the server tree in place (re-indexes rows + updates totals). 🧹✨
 *
 * Shared by every admin list that can delete the last row (doctors, users,
 * articles) plus the contact inbox where a reply can empty a filtered page.
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function usePaginatedRowRefresh(itemsOnPage: number) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎯 removed=true → a row left the current view; false → in-place change only
  return useCallback(
    (removed = true) => {
      const page = Number(searchParams.get('page')) || 1;

      // 🧹 Was the last row on a non-first page → hop back one. force-dynamic
      //    admin pages refetch fresh on navigation, so totals stay correct. ✅
      if (removed && itemsOnPage <= 1 && page > 1) {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page - 1));
        router.replace(`?${params.toString()}`);
        return;
      }

      // 🔄 Page still has rows → refresh in place
      router.refresh();
    },
    [itemsOnPage, router, searchParams],
  );
}
