"use client";

import { useEffect, useSyncExternalStore } from "react";
import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/shared/mobile-menu";
import { useMounted } from "@/hooks/use-mounted";
import { readSessionHint, clearSessionHintClient, subscribeSessionHint } from "@/lib/auth/session-hint";
import type { NavItem } from "@/components/layout/header-shell"; // 🔗 Shared nav shape (DRY)

// ⏳ Desktop user-widget skeleton — matches the dropdown trigger footprint (avatar + name
//    + chevron) so the real dropdown swaps in with zero layout shift. Logged-in users only. 💀
function DesktopUserSkeleton() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 md:px-3 md:py-2" aria-hidden>
      <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200 ring-2 ring-neutral-100 ring-offset-2 animate-pulse" />
      <div className="hidden h-4 w-16 rounded-full bg-neutral-200 animate-pulse md:block" />
      <div className="hidden h-4 w-4 rounded bg-neutral-200 animate-pulse md:block" />
    </div>
  );
}

// 👻 Pre-resolve placeholder — paints nothing but reserves the slot footprint. Shown on SSR
//    + first client render so guests never flash a skeleton and the real widget swaps in cleanly. 🧠
function AuthSlotPlaceholder() {
  return <div className="h-10 w-10 md:w-30" aria-hidden />;
}

// 🙅 Guest CTA — the login / sign-up button (desktop).
function DesktopLoginCta() {
  return (
    <Link href="/auth/login">
      <Button
        variant="default"
        className="relative overflow-hidden rounded-xl bg-linear-to-l cursor-pointer from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary-600/40"
      >
        ورود / ثبت‌نام
      </Button>
    </Link>
  );
}

// 💤 Radix-heavy dropdown loaded on demand. `loading` keeps the skeleton visible
//    while the chunk downloads → no empty slot / pop-in on slow connections. 🚀
const UserDropdownMenu = dynamic(() => import("@/components/shared/user-dropdown-menu"), {
  ssr: false,
  loading: () => <DesktopUserSkeleton />,
});

// 🧭 Header auth payload (=== GET /api/auth/me)
interface MeResponse {
  user: { firstName: string; lastName: string; phone: string | null; avatar: string | null } | null;
  unreadCount: number;
}

// 🔁 SWR dedupes: desktop + mobile widgets share one /api/auth/me request. cache:"no-store"
//    avoids replaying a stale { user: null } after a silent token refresh. 🩹
const fetcher = (url: string): Promise<MeResponse> => fetch(url, { cache: "no-store" }).then((r) => r.json());
const SWR_KEY = "/api/auth/me";
const SWR_OPTS = { revalidateOnFocus: false } as const;

// 🪪 Tri-state session from the non-httpOnly hint cookie: 'pending' (not read → empty
//    placeholder), 'guest' (no hint → login CTA, no fetch), 'authed' (hint set → fetch +
//    skeleton). Starting 'pending' on both SSR & first render keeps hydration exact. ✨
type SessionState = "pending" | "guest" | "authed";

// 🔌 The hint changes on login/logout (this tab, other tabs, or bfcache restore), so we
//    subscribe for real instead of a noop. useSyncExternalStore still serves the 'pending'
//    server snapshot for an exact hydration match, then the live client value. ✨
const getSessionSnapshot = (): SessionState => (readSessionHint() ? "authed" : "guest");
const getSessionServerSnapshot = (): SessionState => "pending";

function useSessionState(): SessionState {
  return useSyncExternalStore(subscribeSessionHint, getSessionSnapshot, getSessionServerSnapshot);
}

// 👤 Profile fetch — enabled only for logged-in users (guests never hit the network).
function useAuthedProfile(enabled: boolean) {
  const { data, error, isValidating } = useSWR<MeResponse>(enabled ? SWR_KEY : null, fetcher, SWR_OPTS);
  const user = data?.user ?? null;

  // ✅ A result we can TRUST = a settled fetch (data or error) that is NOT mid-revalidation.
  //    A stale { user: null } sitting in cache while SWR refetches is NOT settled → never trusted,
  //    so a logout's cached null can never masquerade as "logged out" during the next login. 🧠
  const settled = Boolean(data || error) && !isValidating;

  // 🩹 Genuinely stale hint = the hint says "authed" but a SETTLED fetch confirmed no user
  //    (session revoked server-side, flag lingered). Only THEN do we self-heal the cookie —
  //    never on an un-settled/stale null, so a fresh login is never clobbered. 🧠
  const staleHint = enabled && settled && !user;

  useEffect(() => {
    if (staleHint) clearSessionHintClient();
  }, [staleHint]);

  return { user, unreadCount: data?.unreadCount ?? 0, staleHint };
}

// 🖥️ Desktop — guests get the login button straight away (no skeleton flash on refresh);
//    only logged-in users see the skeleton, and only until their profile resolves. 🧠
export function HomeHeaderAuthDesktop() {
  const state = useSessionState();
  const authed = state === "authed";
  const { user, unreadCount, staleHint } = useAuthedProfile(authed);
  const mounted = useMounted();

  // ⏳ Hint not read yet → invisible placeholder (guests never see a skeleton).
  if (state === "pending") return <AuthSlotPlaceholder />;

  // 🙅 No hint, OR a hint a SETTLED fetch proved stale → login CTA.
  if (state === "guest" || staleHint) return <DesktopLoginCta />;

  // 💀 Logged-in but the profile isn't confirmed yet (loading OR mid-revalidation after login) →
  //    hold the skeleton. Never flashes the login button on a stale { user: null } cache. ✨
  if (!user || !mounted) return <DesktopUserSkeleton />;

  const firstName = user.firstName || "کاربر";
  const lastName  = user.lastName  || "";
  const fullName  = [firstName, lastName].filter(Boolean).join(" ") || "کاربر";
  const initials  = (firstName[0] + (lastName[0] || "")).toUpperCase();

  return (
    <UserDropdownMenu
      user={user}
      fullName={fullName}
      initials={initials}
      unreadCount={unreadCount}
    />
  );
}

// 📱 Mobile — same contract: nothing for guests-pending, a login button for guests, and a
//    skeleton then avatar for logged-in users. The Sheet drawer still loads only on open.
export function HomeHeaderAuthMobile({ navItems }: { navItems: readonly NavItem[] }) {
  const state = useSessionState();
  const authed = state === "authed";
  const { user, unreadCount, staleHint } = useAuthedProfile(authed);

  return (
    <MobileMenu
      navItems={navItems}
      // 🩹 Treat a settled-stale hint as a guest (mirrors desktop) so a logout's cached
      //    null never shows the avatar slot half-broken.
      user={staleHint ? null : user}
      unreadCount={unreadCount}
      // ⏳ Skeleton while a logged-in user's profile is loading OR revalidating after login —
      //    never the login button on a stale { user: null } cache. ✨
      isAuthLoading={authed && !user && !staleHint}
      // 👻 Pre-resolve → render an empty slot (no skeleton, no login flash for guests)
      sessionPending={state === "pending"}
    />
  );
}
