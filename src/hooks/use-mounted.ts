// 🧠 false on server + first client render, true after hydration. Uses useSyncExternalStore
//    (no setState-in-effect) → no churn, no mismatch. Render an SSR-safe placeholder first. ✨
import { useSyncExternalStore } from "react";

const subscribe = () => () => {}; // 🔌 never changes → no-op
const getSnapshot = () => true; // 💻 client
const getServerSnapshot = () => false; // 🖥️ server

export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
