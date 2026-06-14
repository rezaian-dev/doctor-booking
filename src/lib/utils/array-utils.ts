// 🔄 Adds item if missing, removes if present
export const toggleArrayItem = (arr: string[], item: string): string[] =>
  arr.includes(item) ? arr.filter(id => id !== item) : [...arr, item];

// ⭐ Boolean array for star rendering — true = filled
export const buildStars = (rating: number): boolean[] =>
  Array.from({ length: 5 }, (_, i) => i < rating);
