// ⏳ Run a callback once the browser is idle (Safari-safe setTimeout fallback). Returns a cleanup
//    fn that cancels the pending callback — keeps providers from re-implementing requestIdleCallback. 🧠
export function runWhenIdle(cb: () => void, timeout = 2000): () => void {
  if (typeof window === "undefined") return () => {};

  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(cb, { timeout });
    return () => cancelIdleCallback(id);
  }

  const t = setTimeout(cb, 300);
  return () => clearTimeout(t);
}
