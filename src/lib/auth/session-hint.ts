// 🪪 The "session present" hint cookie — a non-httpOnly boolean set alongside the real httpOnly
//    tokens. No identity; it just lets the client header decide login-vs-skeleton synchronously
//    before first paint. Zero server-only imports → safe in the edge proxy, server & client. 🧠

// 🔑 Single source of truth for the cookie name (shared by server + client).
export const SESSION_HINT_COOKIE = "has_session";

// 👁️ Read the hint on the client. SSR has no document → treat as guest (safe default).
//    Matches the exact has_session=1 flag, nothing else.
export function readSessionHint(): boolean {
  if (typeof document === "undefined") return false; // 🖥️ SSR / non-browser
  return document.cookie
    .split("; ")
    .some((c) => c === `${SESSION_HINT_COOKIE}=1`);
}

// 🧹 Expire a stale hint from the client (session revoked server-side but the flag lingered),
//    so the next refresh renders a clean guest header. 🩹
export function clearSessionHintClient(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

// 🔔 Reactive layer — the cookie itself never notifies React, so a noop subscription leaves
//    the header frozen until a hard refresh. This tiny event bus makes auth state LIVE. 🧠
const AUTH_EVENT = "auth:change";

// 🔌 Subscription for useSyncExternalStore: same-tab login/logout (custom event) +
//    cross-tab sync (storage) + back/forward bfcache restore (pageshow). One source, no polling. ✨
export function subscribeSessionHint(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {}; // 🖥️ SSR no-op
  const onStorage = (e: StorageEvent) => { if (e.key === AUTH_EVENT) onChange(); }; // 🪟 only our key
  window.addEventListener(AUTH_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", onChange);
  return () => {
    window.removeEventListener(AUTH_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", onChange);
  };
}

// 📣 Fire right after login/logout → every mounted header re-reads the hint instantly
//    (no router.refresh, no manual reload). The storage write also nudges other tabs. 🚀
export function notifyAuthChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));          // 🔁 this tab
  try { localStorage.setItem(AUTH_EVENT, String(Date.now())); } catch { /* private mode */ } // 🪟 other tabs
}
