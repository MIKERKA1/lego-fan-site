import type { NextConfig } from "next";

// Static export for GitHub Pages. The site lives under /<repo>/ there, so the path prefix comes from
// NEXT_PUBLIC_BASE_PATH (set by the deploy workflow); locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
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
