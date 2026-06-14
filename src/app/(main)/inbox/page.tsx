// ✅ SSR — user-specific messages, always fresh
export const dynamic = "force-dynamic";

import { getUserMessages } from "@/lib/actions/message";
import Inbox from "@/components/shared/inbox";
import { pageMetadata } from "@/lib/utils/seo";

export const metadata = pageMetadata({
  title: "پیام‌ها | دکتر رزرو",
  description: "مشاهده پیام‌های دریافتی.",
  robots: { index: false, follow: false },
});

export default async function InboxPage() {
  const messages = await getUserMessages();

  // 🧱 StandardLayout owns the <main> landmark; this is a styled wrapper only
  return (
    <div className="min-h-screen bg-neutral-50/60">
      <div className="container mx-auto px-4 md:px-8 py-6">
        <Inbox messages={messages} />
      </div>
    </div>
  );
}
