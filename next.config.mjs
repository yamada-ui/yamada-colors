/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  reactStrictMode: false,
  pageExtensions: ["page.jsx", "page.tsx", "api.js", "api.ts"],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
    localeDetection: false,
  },
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["@yamada-ui/lucide"],
  },
}

export default nextConfig
