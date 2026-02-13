/**
 * 🔄 Toggles an item in a string array:
 * - Adds if missing, removes if present.
 */
export const toggleArrayItem = (arr: string[], item: string): string[] =>
  arr.includes(item) ? arr.filter(id => id !== item) : [...arr, item];
