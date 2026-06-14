import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 🧭 Pin the workspace root → stops Next from mis-inferring it from a stray
  //    lockfile in a parent folder (e.g. ~/Downloads). Silences the
  //    "inferred your workspace root" warning. 🤫
  turbopack: {
    root: path.resolve(__dirname),
  },

  // 🚫 Don't advertise the framework via the X-Powered-By header
  poweredByHeader: false,

  // ⚛️ Catch subtle bugs early during development
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    // 🌳 Tree-shake barrel imports → smaller bundles & faster cold starts
    optimizePackageImports: [
      "lucide-react",
      "swiper",
      "radix-ui",
      "sonner",
      "react-day-picker",
      "react-multi-date-picker",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },

  images: {
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/uploads/**" },
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],

    formats: ["image/avif", "image/webp"],

    // ⏱️ Keep optimized images cached at the edge for at least 1 day
    minimumCacheTTL: 86400,
  },

  compress: true,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // 🗄️ Immutable, long-lived caching for static brand assets
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
