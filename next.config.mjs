/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@yamada-ui/lucide"],
  },
  i18n: {
    defaultLocale: "en",
    localeDetection: false,
    locales: ["en", "ja"],
  },
  optimizeFonts: true,
  pageExtensions: ["page.jsx", "page.tsx", "api.js", "api.ts"],
  productionBrowserSourceMaps: false,
  reactStrictMode: false,
}

export default nextConfig
