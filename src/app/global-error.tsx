"use client";

// 🛑 global-error — last-resort boundary for failures in the ROOT layout. It replaces
//    <html>/<body>, so it renders them and stays framework-agnostic (zero next/* imports). 🪨
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 📋 Surface the digest in logs so prod errors stay traceable
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <main
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            padding: "1rem",
          }}
        >
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#111", marginBottom: ".75rem" }}>
              مشکلی پیش آمد
            </h1>
            <p style={{ color: "#555", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              خطایی غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.
            </p>
            {/* 🔄 reset() re-renders the segment without a full reload */}
            <button
              onClick={reset}
              style={{
                height: 40,
                padding: "0 1.5rem",
                background: "#4179f0",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: ".9rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              تلاش مجدد
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
