"use client";

// 🛡️ Soft guard for /auth/*: replaces the old proxy redirect that hard-reloaded the page.
//    router.replace() keeps it a smooth soft nav. Confirms auth via /api/auth/me (not the
//    bare hint cookie) so a stale hint can't trap a real guest on the login page. 🧠✨

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { readSessionHint } from "@/lib/auth/session-hint";
import { useMounted } from "@/hooks/use-mounted";

// 🔁 Same key + payload shape the header uses → SWR DEDUPES the request, so this adds
//    ZERO extra network (the profile is usually already cached from the previous page).
interface MeResponse {
  user: unknown | null;
}
const fetcher = (url: string): Promise<MeResponse> =>
  fetch(url, { cache: "no-store" }).then((r) => r.json());

// 🚫 Never bounce users off the ban notice — anyone must be able to read it.
const EXEMPT = new Set<string>(["/auth/banned"]);

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // 🖥️→💻 SSR-safe: false on server + first client render, so we DON'T read the hint during
  //    hydration → server and client markup match (no hydration mismatch). 🧠
  const mounted = useMounted();
  const exempt = EXEMPT.has(pathname);

  // 👁️ Only after hydration AND only when the hint says "maybe logged in" → fetch;
  //    guests (and the ban page) skip the network entirely.
  const hinted = mounted && readSessionHint() && !exempt;
  const { data } = useSWR<MeResponse>(hinted ? "/api/auth/me" : null, fetcher, {
    revalidateOnFocus: false,
  });

  const isAuthed = Boolean(data?.user) && !exempt;

  // 🏠 Confirmed logged-in → soft redirect home (no full reload).
  useEffect(() => {
    if (isAuthed) router.replace("/");
  }, [isAuthed, router]);

  // ⏳ While a hinted session is being confirmed, hold back the form so a logged-in user
  //    never sees a flash of the login page before the redirect lands.
  if (hinted && data === undefined) return null;
  if (isAuthed) return null;

  return <>{children}</>;
}
