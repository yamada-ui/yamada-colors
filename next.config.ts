import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@yamada-ui/lucide"],
  },
  i18n: {
    defaultLocale: "en",
    localeDetection: false,
    locales: ["en", "ja"],
  },
  pageExtensions: ["page.jsx", "page.tsx", "api.js", "api.ts"],
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
}

export default nextConfig
