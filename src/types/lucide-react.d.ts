// 🔧 Type shim for lucide-react: v0.553 uses "typings" not "types", which some
//    "bundler"-resolution builds miss. Re-export dist .d.ts so tsc + IDE resolve it. ✨
declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react";
}
