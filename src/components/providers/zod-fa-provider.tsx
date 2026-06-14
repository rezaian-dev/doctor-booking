"use client";

/**
 * 🌐 ZodFaProvider — sets zod's global error locale to Persian (fa)
 *
 * Must run once on the client before any form validation fires.
 * Placed high in the component tree (layout) so it covers every form.
 *
 * zod v4 API: z.config({ localeError }) sets the global error formatter.
 * Without this, zod falls back to the built-in English messages for
 * error codes that don't have an explicit message (e.g. invalid_type,
 * too_small without a custom message arg).
 */
import { useEffect } from "react";
import { runWhenIdle } from "@/lib/utils/run-when-idle";

export function ZodFaProvider() {
  useEffect(() => {
    let cancelled = false;

    // ⚡ Code-split: zod (~288KB) + its fa locale load as a separate async chunk, so form-less
    //    pages (e.g. home) don't ship/parse zod up-front → lower TBT. Forms validate once it resolves.
    const run = async () => {
      const [{ z }, faMod] = await Promise.all([
        import("zod"),
        import("zod/v4/locales/fa.js"),
      ]);
      if (!cancelled) z.config(faMod.default());
    };

    // ⏳ Defer to browser idle → the zod chunk downloads/parses only after the
    //    page is interactive, keeping it off the critical path entirely.
    const cancel = runWhenIdle(() => void run());

    return () => {
      cancelled = true;
      cancel();
    };
  }, []);

  return null;
}
