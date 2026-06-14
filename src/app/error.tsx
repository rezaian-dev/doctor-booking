"use client";

// 🧯 Root segment error boundary — catches errors thrown anywhere below the
//    root layout that aren't caught by a more specific (main)/admin boundary.
import { ErrorState } from "@/components/shared/error-state";

export default function RootError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState {...props} scope="Root" />;
}
