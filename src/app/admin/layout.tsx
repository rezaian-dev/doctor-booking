// 🏛️ Admin shell for /admin/** — auth guard + canonical scroll model. 🔒 h-svh overflow-hidden
//    locks the frame; only <main> scrolls → no phantom scrollbars or iOS URL-bar jump.
//    🪝 data-admin-shell triggers the scoped html/body lock in globals.css.
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/get-admin";
import AdminNav from "@/components/admin/layout/admin-nav";
import AdminMobileNav from "@/components/admin/layout/admin-mobile-nav";

// 🔑 Reads cookies per request — keep this segment dynamic.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin(); // 🛡️ redirects to /auth/login when not an admin

  return (
    <div data-admin-shell dir="rtl" className="flex h-svh overflow-hidden bg-neutral-75">
      {/* 🖥️ Desktop sidebar — full-height column; AdminNav scrolls internally if tall */}
      <aside className="hidden h-full w-60 shrink-0 flex-col border-l border-neutral-100 bg-white shadow-sm lg:flex xl:w-64">
        <div className="flex shrink-0 items-center gap-3 border-b border-neutral-100 p-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-500">
            <span className="text-sm font-bold text-white">د</span>
          </div>
          <div>
            <p className="text-sm font-bold text-neutral-900">پنل مدیریت</p>
            <p className="text-xs text-neutral-400">Doctor Booking</p>
          </div>
        </div>
        <AdminNav admin={admin} />
      </aside>

      {/* 📄 Content column — mobile bar pinned, only <main> scrolls */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav admin={admin} />
        {/* 🔒 overflow-y-auto alone makes the X-axis compute to `auto` (CSS spec) → a phantom
            horizontal scrollbar on any 1px spill. Explicit overflow-x-hidden kills it for good. 🧠 */}
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
