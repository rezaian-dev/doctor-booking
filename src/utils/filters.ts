export const toggleArrayItem = (arr: string[], item: string): string[] =>
  arr.includes(item) ? arr.filter(id => id !== item) : [...arr, item];