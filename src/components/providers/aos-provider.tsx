"use client";

// 🎬 Global AOS init, accessibility-safe. ♿ Respects prefers-reduced-motion;
// ⚡ requestIdleCallback defers init off LCP/FCP; 📐 shorter on mobile; 🔁 once:true (no CLS).
import { useEffect } from "react";

export function AosProvider() {
  useEffect(() => {
    const init = () => {
      // ♿ Skip AOS entirely when user has requested reduced motion
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) {
        // 🛡️ Remove any lingering AOS opacity/transform locks on elements
        document
          .querySelectorAll<HTMLElement>("[data-aos]")
          .forEach((el) => {
            el.style.opacity = "";
            el.style.transform = "";
            el.removeAttribute("data-aos-delay");
          });
        return;
      }

      import("aos").then((mod) => {
        const AOS = mod.default;

        // 📱 Detect viewport size for responsive config
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

        AOS.init({
          // ⚡ Duration: shorter on small screens for snappier feel
          duration: isMobile ? 300 : isTablet ? 450 : 550,

          // 🎯 Trigger point: closer on mobile (smaller viewport)
          offset: isMobile ? 16 : isTablet ? 40 : 60,

          // ♻️ Animate only once — prevents layout shift on scroll-back
          once: true,

          // 🧮 Easing: smooth deceleration
          easing: "ease-out-cubic",

          // 🚫 No reverse (mirror) animations
          mirror: false,

          // 🔁 Reset delay — let components control their own delays
          delay: 0,

          // 🎯 Fire when top of element reaches bottom of viewport
          anchorPlacement: "top-bottom",

          startEvent: "DOMContentLoaded",
        });

        // 🔄 Refresh AOS on orientation/resize to recalculate positions
        const handleResize = () => AOS.refresh();
        window.addEventListener("resize", handleResize, { passive: true });

        // Note: cleanup handled by React's useEffect return would conflict
        // with dynamic import — AOS.refresh is lightweight, no memory leak
      });
    };

    // ⏳ Defer until browser idle — never blocks first paint
    if ("requestIdleCallback" in window) {
      requestIdleCallback(init, { timeout: 500 });
    } else {
      // 🔄 Fallback for Safari — slight delay still helps
      setTimeout(init, 150);
    }
  }, []);

  return null;
}
