"use client";

// 🧯 Admin error boundary — scoped recovery UI for the dashboard. No "home"
//    link here; admins should retry or navigate via the sidebar.
import { ErrorState } from "@/components/shared/error-state";

export default function AdminError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      {...props}
      scope="Admin"
      showHome={false}
      description="در پردازش این بخش خطایی رخ داد. لطفاً دوباره تلاش کنید."
    />
  );
}
