// ⏳ Auth-group route skeleton (login / register / banned). The auth pages are STATIC, so in
//    production a prefetched soft-nav renders them instantly and this fallback is skipped. It only
//    appears while a segment is still being fetched/compiled (e.g. `next dev` on-demand build) →
//    turns the brief blank <main> into a stable, form-shaped skeleton: no flash, no jump. 🧩✨
//    Mirrors <AuthForm> 1:1 (branded header + card) so swapping to the real form shifts nothing.

export default function AuthLoading() {
  return (
    <div className="bg-linear-to-b from-neutral-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md" aria-hidden>
        {/* 🏥 Branded header placeholder (icon + title + description) */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-2xl bg-neutral-200" />
          <div className="mx-auto mb-2 h-7 w-48 animate-pulse rounded-lg bg-neutral-200" />
          <div className="mx-auto h-4 w-60 animate-pulse rounded bg-neutral-100" />
        </div>

        {/* 📄 Form card placeholder — two fields + a submit button */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-lg">
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-neutral-100" />
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>

        {/* 🔁 Footer toggle link placeholder */}
        <div className="mt-6 flex justify-center">
          <div className="h-4 w-52 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
