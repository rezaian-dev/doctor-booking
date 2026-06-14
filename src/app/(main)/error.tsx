"use client";

// 🧯 Public-site error boundary — keeps the header/footer shell intact while
//    showing a friendly recovery UI for any failed page under (main).
import { ErrorState } from "@/components/shared/error-state";

export default function MainError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      {...props}
      scope="Main"
      description="در بارگذاری این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید."
    />
  );
}
