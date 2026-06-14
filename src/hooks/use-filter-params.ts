'use client';

import { useCallback, useEffect, useState } from 'react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  search: string; specialty: string[]; city: string[];
  insurance: string[]; experience: string[]; availability: string[]; gender: string;
}

export type ArrayFilterKey = Extract<keyof FilterState,
  'specialty' | 'city' | 'insurance' | 'experience' | 'availability'>;

export const EMPTY_FILTERS: FilterState = {
  search: '', specialty: [], city: [], insurance: [], experience: [], availability: [], gender: '',
};

const ARRAY_KEYS: ArrayFilterKey[] = ['specialty', 'city', 'insurance', 'experience', 'availability'];

export const FILTER_KEY_MAP: Record<string, ArrayFilterKey> = {
  specialties: 'specialty', insurances: 'insurance',
  experience: 'experience', availability: 'availability', city: 'city',
};

// ─── Pure helpers ─────────────────────────────────────────────────────────────

export const hasActiveFilters = (f: FilterState) =>
  !!(f.search.trim() || f.gender || ARRAY_KEYS.some(k => f[k].length));

const filtersEqual = (a: FilterState, b: FilterState) =>
  a.search === b.search && a.gender === b.gender &&
  ARRAY_KEYS.every(k => a[k].length === b[k].length && a[k].every(v => b[k].includes(v)));

// 🎯 True only when an *applied* filter is removed from draft
export const hasRemovedFromCommitted = (draft: FilterState, url: FilterState) =>
  ARRAY_KEYS.some(k => url[k].some(v => !draft[k].includes(v))) ||
  !!(url.search.trim() && !draft.search.trim()) ||
  !!(url.gender && !draft.gender);

// ─── nuqs config ──────────────────────────────────────────────────────────────

const parsers = {
  search:       parseAsString.withDefault(''),
  specialty:    parseAsArrayOf(parseAsString).withDefault([]),
  city:         parseAsArrayOf(parseAsString).withDefault([]),
  insurance:    parseAsArrayOf(parseAsString).withDefault([]),
  experience:   parseAsArrayOf(parseAsString).withDefault([]),
  availability: parseAsArrayOf(parseAsString).withDefault([]),
  gender:       parseAsString.withDefault(''),
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * 📐 Two-layer state:
 *   draft     → user is editing, never hits URL until Apply
 *   committed → lives in URL, what the server sees
 *
 * ✅ Apply   → draft → URL
 * ✅ Remove applied filter → URL immediately (realtime)
 * ✅ Add filter → stays draft until Apply
 * ✅ Back/fwd → URL syncs back to draft
 */
export function useFilterParams() {
  const [committed, setCommitted] = useQueryStates(parsers, {
    history: 'push', scroll: false, shallow: false,
  });

  const url = committed as FilterState;
  const [draft, setDraft] = useState<FilterState>(url);

  const setPatch     = useCallback((p: Partial<FilterState>) => setDraft(prev => ({ ...prev, ...p })), []);
  const setArrayField = useCallback((key: ArrayFilterKey, vals: string[]) =>
    setDraft(prev => ({ ...prev, [key]: [...new Set(vals)] })), []);

  const commit = useCallback((f: FilterState) => setCommitted({ ...f }), [setCommitted]);
  const apply  = useCallback(() => commit(draft), [draft, commit]);
  const reset  = useCallback(() => { setDraft(EMPTY_FILTERS); setCommitted(EMPTY_FILTERS); }, [setCommitted]);

  // 🔑 Realtime removal: commit only when an applied filter is unchecked
  useEffect(() => {
    if (!filtersEqual(draft, url) && hasRemovedFromCommitted(draft, url)) commit(draft);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // 🔄 Sync draft ← URL on browser back/forward
  useEffect(() => {
    setDraft(url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(url)]);

  return {
    draft, committed: url,
    setPatch, setArrayField, apply, reset,
    canApply: !filtersEqual(draft, url) || hasActiveFilters(url),
    canReset: hasActiveFilters(url) || hasActiveFilters(draft),
  };
}
