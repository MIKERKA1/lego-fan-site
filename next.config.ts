import type { NextConfig } from "next";

// Static export for GitHub Pages. The site lives under /<repo>/ there, so the path prefix comes from
// NEXT_PUBLIC_BASE_PATH (set by the deploy workflow); locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // Dev only: phones on the LAN open the dev server by IP. Without this Next blocks /_next/hmr for that
  // origin and the page never hydrates, so every animation is stuck on its static fallback.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
