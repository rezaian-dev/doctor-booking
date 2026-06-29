// 🔒 Resolve a safe "return to" path after create/edit. Only an internal path
//    under the given list root (optionally with a query) is allowed — anything
//    else (external URLs, protocol-relative //evil.com) falls back to the root. ✨
export function safeReturnTo(value: FormDataEntryValue | null, fallback: string): string {
  const v = typeof value === "string" ? value : "";
  return v === fallback || v.startsWith(`${fallback}?`) ? v : fallback;
}

// 🧭 Build a list "return to" URL from the params that define a list view,
//    skipping empties (and page=1) so URLs stay clean. Used by list pages to
//    forward the user's exact spot into the edit link's `?from=…`. 🔙
export function listReturnTo(root: string, params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v || (k === "page" && v === "1")) continue; // 🧹 drop empties + default page
    qs.set(k, v);
  }
  const s = qs.toString();
  return s ? `${root}?${s}` : root;
}
