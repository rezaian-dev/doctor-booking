import type { FilterState } from '@/hooks/use-filter-params';

// 🔢 Count selected chips across all array groups + gender (search excluded — it's a query, not a chip)
const ARRAY_KEYS = ['specialty', 'city', 'insurance', 'experience', 'availability'] as const;

export function countActiveFilters(f: FilterState): number {
  const arrays = ARRAY_KEYS.reduce((sum, k) => sum + f[k].length, 0);
  return arrays + (f.gender ? 1 : 0);
}
